(function () {

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
