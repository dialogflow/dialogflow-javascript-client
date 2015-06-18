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

})();