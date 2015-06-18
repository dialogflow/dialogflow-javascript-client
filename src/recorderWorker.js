function _recorderWorkerJs() {

    var recLength = 0,
        recBuffers = [],
        sampleRate,
        resampler;


    this.onmessage = function (e) {
        switch (e.data.command) {
            case 'init':
                init(e.data.config);
                break;
            case 'record':
                record(e.data.buffer);
                break;
            case 'export16kMono':
                export16kMono(e.data.type);
                break;
            case 'getBuffer':
                getBuffer();
                break;
            case 'clear':
                clear();
                break;
        }
    };

    function init(config) {
        // Invoke initializer to register Resampler within navigator object
        (new Function(config.resamplerInitializerBody))();

        sampleRate = config.sampleRate;
        resampler = new navigator.Resampler(sampleRate, 16000, 1, 50 * 1024);
    }

    function record(inputBuffer) {
        recBuffers.push(inputBuffer[0]);
        recLength += inputBuffer[0].length;
    }

    function export16kMono(type) {
        var buffer = mergeBuffers(recBuffers, recLength);
        var samples = resampler.resampler(buffer);
        var dataview = encodeRAW(samples);
        var audioBlob = new Blob([dataview], {type: type});

        this.postMessage(audioBlob);
    }

    function getBuffer() {
        var buffers = [];
        buffers.push(mergeBuffers(recBuffers, recLength));
        this.postMessage(buffers);
    }

    function clear() {
        recLength = 0;
        recBuffers = [];
    }

    function mergeBuffers(recBuffers, recLength) {
        var result = new Float32Array(recLength);
        var offset = 0;
        for (var i = 0; i < recBuffers.length; i++) {
            result.set(recBuffers[i], offset);
            offset += recBuffers[i].length;
        }
        return result;
    }

    function _floatTo16BitPCM(output, offset, input) {
        for (var i = 0; i < input.length; i++, offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }

    function _writeString(view, offset, string) {
        for (var i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    function encodeWAV(samples) {
        var buffer = new ArrayBuffer(44 + samples.length * 2);
        var view = new DataView(buffer);

        /* RIFF identifier */
        _writeString(view, 0, 'RIFF');
        /* file length */
        view.setUint32(4, 32 + samples.length * 2, true);
        /* RIFF type */
        _writeString(view, 8, 'WAVE');
        /* format chunk identifier */
        _writeString(view, 12, 'fmt ');
        /* format chunk length */
        view.setUint32(16, 16, true);
        /* sample format (raw) */
        view.setUint16(20, 1, true);
        /* channel count */
        view.setUint16(22, 2, true);
        /* sample rate */
        view.setUint32(24, sampleRate, true);
        /* byte rate (sample rate * block align) */
        view.setUint32(28, sampleRate * 4, true);
        /* block align (channel count * bytes per sample) */
        view.setUint16(32, 4, true);
        /* bits per sample */
        view.setUint16(34, 16, true);
        /* data chunk identifier */
        _writeString(view, 36, 'data');
        /* data chunk length */
        view.setUint32(40, samples.length * 2, true);

        _floatTo16BitPCM(view, 44, samples);

        return view;
    }

    function encodeRAW(samples) {
        var buffer = new ArrayBuffer(samples.length * 2);
        var view = new DataView(buffer);
        _floatTo16BitPCM(view, 0, samples);
        return view;
    }

}
