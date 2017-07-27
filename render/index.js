"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pickupComponent_1 = require("./ui/pickupComponent");
var Youtube = (function () {
    function Youtube() {
        this.name = "youtube";
        this.type = "source";
    }
    Youtube.prototype.setPlugins = function (plugins) {
        // シングルトン参照で必要なbasePluginを保持
        this.basePlugin = plugins["base"][0];
    };
    Youtube.prototype.refPickupComponent = function () {
        return pickupComponent_1.pickupComponent();
    };
    Youtube.prototype.createNewSource = function () {
        return null;
    };
    return Youtube;
}());
exports.Youtube = Youtube;
exports._ = new Youtube();
