"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Source = (function () {
    function Source(basePlugin, youtubeId) {
        var _this = this;
        this.name = youtubeId; // 本当はyoutubeの動画の名称とりたいけど、面倒なので、やらない
        this.id = youtubeId;
        this.info = {};
        this.gainNode = basePlugin.refAudioContext().createGain();
        this.gainNode.gain.value = 1.0;
        this.gainNode.connect(basePlugin.refDevnullNode());
        // 同じidのデータがすでにある場合は動作しない方がいいと思う
        var div = document.createElement("div");
        div.id = youtubeId;
        div.style["display"] = "none";
        document.body.appendChild(div);
        var done = false;
        this.player = new YT.Player(youtubeId, {
            videoId: youtubeId,
            events: {
                "onReady": function () {
                    // 一瞬再生してとめとく。
                    _this.player.playVideo();
                    _this.media.play();
                },
                "onStateChange": function (event) {
                    if (event.data == YT.PlayerState.PLAYING && !done) {
                        setTimeout(function () {
                            // 即止める
                            _this.media.pause();
                            _this.player.pauseVideo();
                            _this.video = document.getElementById(youtubeId).contentWindow.document.getElementsByTagName("video")[0];
                            // あとはこのvideoからnodeをつくっておかないといけない。
                            _this.node = basePlugin.refAudioContext().createMediaElementSource(_this.video);
                            _this.node.connect(_this.gainNode);
                        }, 500);
                        done = true;
                    }
                }
            }
        }); // これで再生に必要なものは準備できてる。
        // このデータはこのまま再生までもっていって、そのまま停止しとく。
        // あとは見えないcanvasをつくっておく
        // あとのコントロールは応答で返すvideoタグの動作でコントロールする
        this.canvas = document.createElement("canvas");
        document.body.appendChild(this.canvas);
        this.canvas.style["position"] = "absolute";
        this.canvas.style["top"] = "-9999px";
        // このcanvasにyoutubeの動画データを書き込んでく
        this.media = document.createElement("video");
        this.media.srcObject = this.canvas.captureStream();
        this.media.controls = true;
        this.media.onplay = function () {
            _this.player.playVideo();
        };
        this.media.onpause = function () {
            _this.player.pauseVideo();
        };
        // あとはrequest animation frameでyoutubeの映像の部分だけ、あっちにコピーする
        var draw = function () {
            if (_this.video) {
                var width = _this.video.videoWidth;
                var height = _this.video.videoHeight;
                if (width != 0 && height != 0) {
                    _this.canvas.width = width;
                    _this.canvas.height = height;
                    var ctx = _this.canvas.getContext("2d");
                    ctx.drawImage(_this.video, 0, 0, width, height);
                }
            }
            _this.requestId = requestAnimationFrame(draw);
        };
        draw();
    }
    Source.prototype.release = function () {
        var _this = this;
        cancelAnimationFrame(this.requestId);
        Object.keys(this.info).forEach(function (key) {
            var info = _this.info[key];
            info.plugin.onRemoveSource(_this);
        });
        this.media.pause();
        this.node.disconnect();
        this.gainNode.disconnect();
        this.video = null;
        this.media = null;
        this.node = null;
        this.gainNode = null;
        this.canvas = null;
        this.player.pauseVideo();
        this.player = null;
        document.body.removeChild(document.getElementById(this.id));
    };
    Source.prototype.refInfo = function (mediaPlugin) {
        if (typeof (this.info[mediaPlugin.name]) == "undefined") {
            this.info[mediaPlugin.name] = {
                plugin: mediaPlugin,
                data: {}
            };
        }
        return this.info[mediaPlugin.name];
    };
    Source.prototype.refAudioNode = function () {
        return this.gainNode;
    };
    Source.prototype.refVideoImage = function () {
        return this.video;
    };
    Source.prototype.refDisplayElement = function () {
        return this.media;
    };
    Source.prototype.setVolume = function (value) {
        this.gainNode.gain.value = value / 100;
    };
    Source.prototype.getVolume = function () {
        return this.gainNode.gain.value * 100;
    };
    return Source;
}());
exports.Source = Source;
