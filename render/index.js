"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var source_1 = require("./source");
var pickupComponent_1 = require("./ui/pickupComponent");
var Youtube = (function () {
    function Youtube() {
        this.name = "youtube";
        this.type = "source";
        this.youtubeId = null;
        var script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(script);
    }
    Youtube.prototype.setPlugins = function (plugins) {
        // シングルトン参照で必要なbasePluginを保持
        this.basePlugin = plugins["base"][0];
    };
    Youtube.prototype.refPickupComponent = function () {
        return pickupComponent_1.pickupComponent(this);
    };
    Youtube.prototype._setYoutubeId = function (id) {
        this.youtubeId = id;
    };
    Youtube.prototype.createNewSource = function () {
        if (this.youtubeId == null) {
            // 保持データがない場合は新規作成しない
            return null;
        }
        return new source_1.Source(this.basePlugin, this.youtubeId);
    };
    return Youtube;
}());
exports.Youtube = Youtube;
exports._ = new Youtube();
