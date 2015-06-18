(function () {

    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    AudioContext.prototype.createResampleProcessor = function (bufferSize, numberOfInputChannels, numberOfOutputChannels, destinationSampleRate) {
        var script_processor = this.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
        var resampler = new navigator.Resampler(this.sampleRate, destinationSampleRate, numberOfInputChannels, bufferSize, true);

        script_processor.onaudioprocess = function (event) {
            var inp = event.inputBuffer.getChannelData(0);
            var out = event.outputBuffer.getChannelData(0);
            var l = resampler.resampler(inp);
            for (var i = 0; i < l; ++i) {
                out[i] = resampler.outputBuffer[i];
            }
        };

        return script_processor;
    };

    function MagicBuffer(chunkSize) {
        this.chunkSize = chunkSize;
        this.array_data = [];

        this.callback = null;
    }

    MagicBuffer.prototype.push = function (array) {
        var l = array.length;
        var new_array = new Array(Math.ceil(l / 2));

        for (var i = 0; i < l; i += 2) {
            new_array[i / 2] = array[i];
        }

        Array.prototype.push.apply(this.array_data, new_array);
        this.process();
    };

    MagicBuffer.prototype.process = function () {
        var elements;
        while (this.array_data.length > this.chunkSize) {
            elements = this.array_data.splice(0, this.chunkSize);

            if (this.callback) {
                this.callback(elements);
            }
        }
    };

    MagicBuffer.prototype.drop = function () {
        this.array_data.splice(0, this.array_data.length);
    };

    AudioContext.prototype.createEndOfSpeechProcessor = function (bufferSize) {
        var script_processor = this.createScriptProcessor(bufferSize, 1, 1);

        script_processor.endOfSpeechCallback = null;

        var vad = new VAD();

        script_processor.vad = vad;

        var buffer = new MagicBuffer(160);

        buffer.callback = function (elements) {
            var vad_result = vad.process(elements);

            if (vad_result !== 'CONTINUE' && script_processor.endOfSpeechCallback) {
                script_processor.endOfSpeechCallback();
                buffer.drop();
            }
        };

        script_processor.onaudioprocess = function (event) {
            var inp = event.inputBuffer.getChannelData(0);
            var out = event.outputBuffer.getChannelData(0);
            buffer.push(inp);

            for (var i = 0; i < inp.length; i++) {
                out[i] = inp[i];
            }
        };

        return script_processor;
    };

})();