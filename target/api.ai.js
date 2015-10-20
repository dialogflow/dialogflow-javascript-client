function _resamplerJs() {

    function Resampler(fromSampleRate, toSampleRate, channels, outputBufferSize, noReturn) {
        this.fromSampleRate = fromSampleRate;
        this.toSampleRate = toSampleRate;
        this.channels = channels | 0;
        this.outputBufferSize = outputBufferSize;
        this.noReturn = !!noReturn;
        this.initialize();
    }

    Resampler.prototype.initialize = function () {
        //Perform some checks:
        if (this.fromSampleRate <= 0 || this.toSampleRate <= 0 || this.channels <= 0) {
            throw(new Error("Invalid settings specified for the resampler."));
        }

        if (this.fromSampleRate == this.toSampleRate) {
            //Setup a resampler bypass:
            this.resampler = this.bypassResampler;    	//Resampler just returns what was passed through.
            this.ratioWeight = 1;
        } else {

            //Resampler is a custom quality interpolation algorithm.
            this.resampler = function (buffer) {
                var bufferLength = Math.min(buffer.length, this.outputBufferSize);

                if ((bufferLength % this.channels) != 0) {
                    throw(new Error("Buffer was of incorrect sample length."));
                }

                if (bufferLength <= 0) {
                    return (this.noReturn) ? 0 : [];
                }

                var weight = 0;
                var output = new Array(this.channels);
                for (var channel = 0; channel < this.channels; ++channel) {
                    output[channel] = 0;
                }
                var actualPosition = 0;
                var amountToNext = 0;
                var alreadyProcessedTail = !this.tailExists;
                this.tailExists = false;
                var outputBuffer = this.outputBuffer;
                var outputOffset = 0;
                var currentPosition = 0;
                var ratioWeight = this.ratioWeight;
                do {
                    if (alreadyProcessedTail) {
                        weight = ratioWeight;
                        for (channel = 0; channel < this.channels; ++channel) {
                            output[channel] = 0;
                        }
                    } else {
                        weight = this.lastWeight;
                        for (channel = 0; channel < this.channels; ++channel) {
                            output[channel] = this.lastOutput[channel];
                        }
                        alreadyProcessedTail = true;
                    }

                    while (weight > 0 && actualPosition < bufferLength) {
                        amountToNext = 1 + actualPosition - currentPosition;
                        if (weight >= amountToNext) {
                            for (channel = 0; channel < this.channels; ++channel) {
                                output[channel] += buffer[actualPosition++] * amountToNext;
                            }
                            currentPosition = actualPosition;
                            weight -= amountToNext;
                        } else {
                            for (channel = 0; channel < this.channels; ++channel) {
                                output[channel] += buffer[actualPosition + ((channel > 0) ? channel : 0)] * weight;
                            }
                            currentPosition += weight;
                            weight = 0;
                            break;
                        }
                    }

                    if (weight == 0) {
                        for (channel = 0; channel < this.channels; ++channel) {
                            outputBuffer[outputOffset++] = output[channel] / ratioWeight;
                        }
                    } else {
                        this.lastWeight = weight;
                        for (channel = 0; channel < this.channels; ++channel) {
                            this.lastOutput[channel] = output[channel];
                        }
                        this.tailExists = true;
                        break;
                    }
                } while (actualPosition < bufferLength);

                return this.bufferSlice(outputOffset);
            };
            this.ratioWeight = this.fromSampleRate / this.toSampleRate;
            this.tailExists = false;
            this.lastWeight = 0;
            this.initializeBuffers();
        }
    };
    Resampler.prototype.bypassResampler = function (buffer) {
        if (this.noReturn) {
            //Set the buffer passed as our own, as we don't need to resample it:
            this.outputBuffer = buffer;
            return buffer.length;
        } else {
            //Just return the buffer passsed:
            return buffer;
        }
    };
    Resampler.prototype.bufferSlice = function (sliceAmount) {
        if (this.noReturn) {
            //If we're going to access the properties directly from this object:
            return sliceAmount;
        } else {
            //Typed array and normal array buffer section referencing:
            try {
                return this.outputBuffer.subarray(0, sliceAmount);
            }
            catch (error) {
                try {
                    //Regular array pass:
                    this.outputBuffer.length = sliceAmount;
                    return this.outputBuffer;
                }
                catch (error) {
                    //Nightly Firefox 4 used to have the subarray function named as slice:
                    return this.outputBuffer.slice(0, sliceAmount);
                }
            }
        }
    };
    Resampler.prototype.initializeBuffers = function () {
        //Initialize the internal buffer:
        try {
            this.outputBuffer = new Float32Array(this.outputBufferSize);
            this.lastOutput = new Float32Array(this.channels);
        }
        catch (error) {
            this.outputBuffer = [];
            this.lastOutput = [];
        }
    };

    navigator.Resampler = Resampler;

}

_resamplerJs();
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
(function () {

    function Recorder(source, cfg) {
        var config = cfg || {};
        var bufferLen = config.bufferLen || 4096;
        this.context = source.context;
        this.node = this.context.createScriptProcessor(bufferLen, 1, 1);
        var worker = new Worker(_getRecorderWorkerUrl());
        worker.postMessage({
            command: 'init',
            config: {
                sampleRate: this.context.sampleRate,
                resamplerInitializerBody: _getFuntionBody(_resamplerJs)
            }
        });
        var recording = false,
            currCallback;

        this.node.onaudioprocess = function (e) {
            if (!recording) return;
            worker.postMessage({
                command: 'record',
                buffer: [
                    e.inputBuffer.getChannelData(0)
                ]
            });
        };

        this.configure = function (cfg) {
            for (var prop in cfg) {
                if (cfg.hasOwnProperty(prop)) {
                    config[prop] = cfg[prop];
                }
            }
        };

        this.record = function () {
            recording = true;
        };

        this.stop = function () {
            recording = false;
        };

        this.clear = function () {
            worker.postMessage({command: 'clear'});
        };

        this.getBuffer = function (cb) {
            currCallback = cb || config.callback;
            worker.postMessage({command: 'getBuffer'})
        };

        this.export16kMono = function (cb, type) {
            currCallback = cb || config.callback;
            type = type || config.type || 'audio/raw';
            if (!currCallback) throw new Error('Callback not set');
            worker.postMessage({
                command: 'export16kMono',
                type: type
            });
        };

        worker.onmessage = function (e) {
            currCallback(e.data);
        };

        source.connect(this.node);
        this.node.connect(this.context.destination);
    }


    function _getRecorderWorkerUrl() {
        var getBlobUrl = (window.URL && URL.createObjectURL.bind(URL)) ||
            (window.webkitURL && webkitURL.createObjectURL.bind(webkitURL)) ||
            window.createObjectURL;

        return getBlobUrl(new Blob([_getFuntionBody(_recorderWorkerJs)], {type: 'text/javascript'}));
    }

    function _getFuntionBody(fn) {
        if (typeof fn !== 'function') {
            throw new Error("Illegal argument exception: argument is not a funtion: " + fn);
        }
        var fnStr = fn.toString(),
            start = fnStr.indexOf('{'),
            fin = fnStr.lastIndexOf('}');

        return (start > 0 && fin > 0) ? fnStr.substring(start + 1, fin) : fnStr;
    }


    window.Recorder = Recorder;

})();(function () {

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

})();(function () {

    function VAD() {
        this.reset()
    }

    VAD.prototype.process = function (frame) {
        var active = this.frameActive(frame);
        this.time = this.frameNumber * 160.0 / 16000.0;

        if (active) {
            if (this.lastActiveTime >= 0 && (this.time - this.lastActiveTime) < this.silenceLengthMilis) {
                this.sequenceCounter++;
                if (this.sequenceCounter >= this.minSequenceCount) {
                    this.lastSequenceTime = this.time;
                    this.silenceLengthMilis = Math.max(this.minSilenceLengthMilis, this.silenceLengthMilis - (this.maxSilenceLengthMilis - this.minSilenceLengthMilis) / 4.0);
                }
            } else {
                this.sequenceCounter = 1;
            }

            this.lastSequenceTime = this.time;
        } else {
            if (this.time - this.lastSequenceTime > this.silenceLengthMilis) {
                if (this.lastSequenceTime > 0) {
                    return 'TERMINATE';
                } else {
                    return 'NO_SPEECH';
                }
            }
        }

        return 'CONTINUE';
    };

    VAD.prototype.frameActive = function (frame) {
        var energy = 0;
        var czCount = 0;

        var lastsign = 0;
        var frame_length = frame.length;

        for (var i = 0; i < frame_length; i++) {
            energy += (frame[i] * frame[i]) / 160.0;

            var sign = 0;
            if (frame[i] > 0) {
                sign = 1;
            } else {
                sign = -1;
            }

            if (lastsign != 0 && sign != lastsign) {
                czCount++;
            }

            lastsign = sign;
        }

        this.frameNumber += 1;

        var result = false;

        if (this.frameNumber < this.noiseFrames) {
            this.noiseEnergy += energy / this.noiseFrames;
            console.log('noiseEnergy=', this.noiseEnergy);
        } else {
            if (czCount >= this.minCZ && czCount <= this.maxCZ) {
                if (energy > /*this.noiseEnergy*/ Math.max(0.01, this.noiseEnergy) * this.energyFactor) {
                    result = true;
                }
            }
        }

        return result;
    };

    VAD.prototype.reset = function () {
        this.minCZ = 5;
        this.maxCZ = 15;

        this.frameLengthMilis = 10.0;
        this.maxSilenceLengthMilis = 3.5;
        this.minSilenceLengthMilis = 0.8;
        this.silenceLengthMilis = this.maxSilenceLengthMilis;
        this.sequenceLengthMilis = 0.03;
        this.minSequenceCount = 3;
        this.energyFactor = 3.1;

        this.noiseFrames = Math.round(150. / this.frameLengthMilis);
        this.noiseEnergy = 0.0;
        this.frameNumber = 0;
        this.lastActiveTime = -1.0;
        this.lastSequenceTime = 0.0;
        this.sequenceCounter = 0;
        this.time = 0.0;
    };

    window.VAD = VAD;

})();(function () {

    function TTS(server, access_token, audio_context, lang) {
        if (!(server && access_token)) {
            throw 'Illegal TTS arguments: server and access_token are required.';
        }

        this.access_token = access_token;
        this.server = server;
        this.lang = lang;

        if (audio_context) {
            this.audio_context = audio_context;
        } else {
            var AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audio_context = new AudioContext();
        }
    }

    TTS.prototype.tts = function (text, onended, lang) {
        if (!text) {
            return;
        }
        var _this = this;

        text = encodeURIComponent(encodeURIComponent(text));// hack for platform's tts.

        var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
        var xhr = new XHR();

        lang = lang || _this.lang || 'en-US';

        xhr.open('GET', 'https://' + _this.server + '/api/tts?access_token=' + _this.access_token + '&lang=' + lang + '&text=' + text, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function (response) {
            var data = this.response;
            //data = response.currentTarget.response;
            speek(data, onended);
        };
        xhr.onerror = function (error) {
            console.log('HttpRequest: Status:', this.status, 'Reason:', error);
        };

        xhr.send();

        function speek(data, onended) {
            var audio_context = _this.audio_context;

            audio_context.decodeAudioData(data, playSound, handleError);

            function playSound(buffer) {
                console.log('play speech...');
                var source = audio_context.createBufferSource(); // creates a sound source
                source.buffer = buffer;                    // tell the source which sound to play
                source.connect(audio_context.destination);       // connect the source to the context's destination (the speakers)
                source.onended = onended;
                source.start(0);                           // play the source now
                                                           // note: on older systems, may have to use deprecated noteOn(time);
            }

            function handleError(error) {
                console.log('TTS decodeAudioData error is', error);
            }
        }

    };

    window.TTS = TTS;

})();
(function () {

    // Defaults
    var CONTENT_TYPE = "content-type=audio/x-raw,+layout=(string)interleaved,+rate=(int)16000,+format=(string)S16LE,+channels=(int)1";
    // Send blocks 4 x per second as recommended in the server doc.
    var INTERVAL = 250;
    var TAG_END_OF_SENTENCE = "EOS";

    // Error codes (mostly following Android error names and codes)
    var ERR_NETWORK = 2;
    var ERR_AUDIO = 3;
    var ERR_SERVER = 4;
    var ERR_CLIENT = 5;

    // Event codes
    var MSG_WAITING_MICROPHONE = 1;
    var MSG_MEDIA_STREAM_CREATED = 2;
    var MSG_INIT_RECORDER = 3;
    var MSG_RECORDING = 4;
    var MSG_SEND = 5;
    var MSG_SEND_EMPTY = 6;
    var MSG_SEND_EOS_OR_JSON = 7;
    var MSG_WEB_SOCKET = 8;
    var MSG_WEB_SOCKET_OPEN = 9;
    var MSG_WEB_SOCKET_CLOSE = 10;
    var MSG_STOP = 11;
    var MSG_CONFIG_CHANGED = 12;


    function ApiAi(cfg) {
        var config = cfg || {};
        var _this = this;

        //var resample_processor;
        //var mediaStreamSource;
        //var audio_context;
        //var recorder;
        //var ws;
        //var intervalKey;

        _this.server = config.server || '';
        _this.token = config.token || '';
        _this.sessionId = config.sessionId || '';
        _this.lang = config.lang || 'en';
        _this.contentType = config.contentType || CONTENT_TYPE;
        _this.readingInterval = config.readingInterval || INTERVAL;

        _this.onOpen = config.onOpen && config.onOpen.bind(_this) || _noop;
        _this.onClose = config.onClose && config.onClose.bind(_this) || _noop;
        _this.onInit = config.onInit && config.onInit.bind(_this) || _noop;
        _this.onStartListening = config.onStartListening && config.onStartListening.bind(_this) || _noop;
        _this.onStopListening = config.onStopListening && config.onStopListening.bind(_this) || _noop;
        _this.onResults = config.onResults && config.onResults.bind(_this) || _noop;
        _this.onEvent = config.onEvent && config.onEvent.bind(_this) || _noop;
        _this.onError = config.onError && config.onError.bind(_this) || _noop;

        function _noop() {
        }
    }

    /**
     * Initializes audioContext
     * Set up the recorder (incl. asking permission)
     * Can be called multiple times.
     */
    ApiAi.prototype.init = function () {
        var _this = this;

        _this.onEvent(MSG_WAITING_MICROPHONE, "Waiting for approval to access your microphone ...");
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
            window.URL = window.URL || window.webkitURL;
            _this.audio_context = new AudioContext();
        } catch (e) {
            // Firefox 24: TypeError: AudioContext is not a constructor
            // Set media.webaudio.enabled = true (in about:config) to fix this.
            _this.onError(ERR_CLIENT, "Error initializing Web Audio browser: " + JSON.stringify(e));
        }

        if (navigator.getUserMedia) {
            navigator.getUserMedia({audio: true}, _startUserMedia.bind(null, _this.onInit), function (e) {
                _this.onError(ERR_CLIENT, "No live audio input in this browser: " + JSON.stringify(e));
            });
        } else {
            _this.onError(ERR_CLIENT, "No user media support");
        }

        function _startUserMedia(onInit, stream) {
            _this.mediaStreamSource = _this.audio_context.createMediaStreamSource(stream);
            _this.onEvent(MSG_MEDIA_STREAM_CREATED, 'Media stream created');

            // make the analyser available in window context
            window.userSpeechAnalyser = _this.audio_context.createAnalyser();

            _this.mediaStreamSource.connect(window.userSpeechAnalyser);

            _this.recorder = new Recorder(_this.mediaStreamSource);
            _this.onEvent(MSG_INIT_RECORDER, 'Recorder initialized');

            onInit && onInit();
        }

    };

    /**
     * Chck if recorder is initialise.
     * @returns {boolean}
     */
    ApiAi.prototype.isInitialise = function () {
        return !!this.recorder;
    };

    /**
     * Send object as json
     * @param json - javascript map.
     */
    ApiAi.prototype.sendJson = function (json) {
        this._socketSend(JSON.stringify(json));
        this._socketSend(TAG_END_OF_SENTENCE);
    };

    /**
     * Start recording and transcribing
     */
    ApiAi.prototype.startListening = function () {
        var _this = this;
        var recorder = _this.recorder;
        if (!recorder) {
            _this.onError(ERR_AUDIO, 'Recorder undefined');
            return;
        }
        if (!_this.ws) {
            _this.onError(ERR_AUDIO, 'No web socket connection');
            return;
        }

        _useVad(function () {
            _this.stopListening();
        });

        _this.ws.send("{'timezone':'America/New_York', 'lang':'" + _this.lang + "', 'sessionId':'" + _this.sessionId + "'}");

        _this.intervalKey = setInterval(function () {
            recorder.export16kMono(function (blob) {
                _this._socketSend(blob);
                recorder.clear();
            }, 'audio/x-raw');
        }, _this.readingInterval);
        // Start recording
        recorder.record();
        _this.onStartListening();// call interface method

        function _useVad(endOfSpeechCallback) {
            _this.resample_processor = _this.audio_context.createResampleProcessor(256, 1, 1, 16000);

            _this.mediaStreamSource.connect(_this.resample_processor);

            var endOfSpeechProcessor = _this.audio_context.createEndOfSpeechProcessor(256);
            endOfSpeechProcessor.endOfSpeechCallback = endOfSpeechCallback;
            _this.resample_processor.connect(endOfSpeechProcessor);
        }
    };

    /**
     * Stop listening, i.e. recording and sending of new input.
     */
    ApiAi.prototype.stopListening = function () {
        var _this = this;

        _this.resample_processor && _this.resample_processor.disconnect();

        // Stop the regular sending of audio
        clearInterval(_this.intervalKey);

        var recorder = _this.recorder;
        if (!recorder) {
            _this.onError(ERR_AUDIO, 'Recorder undefined');
            return;
        }

        // Stop recording
        recorder.stop();
        _this.onEvent(MSG_STOP, 'Stopped recording');
        // Push the remaining audio to the server
        recorder.export16kMono(function (blob) {
            _this._socketSend(blob);
            _this._socketSend(TAG_END_OF_SENTENCE);
            recorder.clear();
        }, 'audio/x-raw');
        _this.onStopListening();// call interface method
    };

    /**
     * Check if websocket is open
     */
    ApiAi.prototype.isOpen = function () {
        return !!this.ws;
    };
    /**
     * Open websocket
     */
    ApiAi.prototype.open = function () {
        var _this = this;

        if (!this.recorder) {
            this.init(_openWebSocket);
        } else {
            _openWebSocket();
        }

        function _openWebSocket() {
            if (!_this.recorder) {
                _this.onError(ERR_AUDIO, "Recorder undefined");
                return;
            }

            if (_this.ws) {
                _this.close();
            }

            try {
                _this.ws = _createWebSocket();
            } catch (e) {
                _this.onError(ERR_CLIENT, "No web socket support in this browser!");
            }

            function _createWebSocket() {
                var url = _this.server + '?' + _this.contentType + '&access_token=' + _this.token;
                var ws = new WebSocket(url);

                ws.onmessage = function (e) {
                    var data = e.data;
                    _this.onEvent(MSG_WEB_SOCKET, data);

                    if (data instanceof Object && !(data instanceof Blob)) {
                        _this.onError(ERR_SERVER, 'WebSocket: onEvent: got Object that is not a Blob');
                    } else if (data instanceof Blob) {
                        _this.onError(ERR_SERVER, 'WebSocket: got Blob');
                    } else {
                        _this.onResults(JSON.parse(data));// call interface method
                    }
                };

                // Start recording only if the socket becomes open
                ws.onopen = function (e) {
                    // send first request for initialisation dialogue
                    //ws.send("{'timezone':'America/New_York', 'lang':'en'}");
                    _this.onOpen();// call interface method
                    _this.onEvent(MSG_WEB_SOCKET_OPEN, e);
                };

                // This can happen if the blob was too big
                // E.g. "Frame size of 65580 bytes exceeds maximum accepted frame size"
                // Status codes
                // http://tools.ietf.org/html/rfc6455#section-7.4.1
                // 1005:
                // 1006:
                ws.onclose = function (e) {
                    // The server closes the connection (only?)
                    // when its endpointer triggers.
                    _this.onClose();// call interface method
                    _this.onEvent(MSG_WEB_SOCKET_CLOSE, e.code + "/" + e.reason + "/" + e.wasClean);
                };

                ws.onerror = function (e) {
                    _this.onError(ERR_NETWORK, JSON.stringify(e.data));
                };

                return ws;
            }
        }

    };

    /**
     * Cancel everything without waiting on the server
     */
    ApiAi.prototype.close = function () {
        var _this = this;
        // Stop the regular sending of audio (if present)
        clearInterval(_this.intervalKey);
        if (_this.recorder) {
            _this.recorder.stop();
            _this.recorder.clear();
            _this.onEvent(MSG_STOP, 'Stopped recording');
        }
        if (_this.ws) {
            _this.ws.close();
            _this.ws = null;
        }
    };


    ApiAi.prototype._socketSend = function (item) {
        var _this = this;
        if (!_this.ws) {
            _this.onError(ERR_CLIENT, 'No web socket connection: failed to send: ' + item);
            return;
        }

        var state = _this.ws.readyState;
        if (state != 1) {
            var errorMsg = 'WebSocket: ';
            switch (state) {
                case 0: // CONNECTING
                    errorMsg += 'The connection is not yet open.';
                    break;
                //case 1:break;// OPEN
                case 2:// CLOSING
                    errorMsg += 'The connection is in the process of closing.';
                    break;
                case 3:// CLOSED
                    errorMsg += 'The connection is closed or couldn\'t be opened.';
                    break;
            }
            errorMsg += ' readyState=' + state + ' (!=1) failed to send: ' + item;
            _this.onError(ERR_NETWORK, errorMsg);
        }

        // If item isn't an audio blob it's the EOS tag or json data (string)
        if (!(item instanceof Blob)) {
            _this.ws.send(item);
            _this.onEvent(MSG_SEND_EOS_OR_JSON, 'Send string: ' + item);
        } else if (item.size > 0) {
            _this.ws.send(item);
            _this.onEvent(MSG_SEND, 'Send: blob: ' + item.type + ', ' + item.size);
        } else {
            _this.onEvent(MSG_SEND_EMPTY, 'Send: blob: ' + item.type + ', EMPTY');
        }
    };


    window.ApiAi = ApiAi;

})();
