"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var ReactBootstrap = require("react-bootstrap");
var Form = ReactBootstrap.Form;
var FormGroup = ReactBootstrap.FormGroup;
var FormControl = ReactBootstrap.FormControl;
var InputGroup = ReactBootstrap.InputGroup;
var Button = ReactBootstrap.Button;
exports.pickupComponent = function (youtube) {
    youtube._setYoutubeId(null);
    return (function (_super) {
        __extends(pickupComponent, _super);
        function pickupComponent() {
            var _this = _super.call(this) || this;
            _this.state = { id: "" };
            _this.open = _this.open.bind(_this);
            return _this;
        }
        pickupComponent.prototype.open = function () {
            var id = ReactDOM.findDOMNode(this.refs.id).value;
            this.setState({ id: id });
            youtube._setYoutubeId(id);
        };
        pickupComponent.prototype.render = function () {
            return (React.createElement(Form, null,
                React.createElement(FormGroup, null,
                    React.createElement(InputGroup, null,
                        React.createElement(FormControl, { type: "text", ref: "id" }),
                        React.createElement(InputGroup.Button, null,
                            React.createElement(Button, { onClick: this.open },
                                React.createElement("span", { className: "glyphicon glyphicon-film", "aria-hidden": "true" }))))),
                (function (id) {
                    if (id != "") {
                        return React.createElement("iframe", { width: "320", height: "240", src: "https://www.youtube.com/embed/" + id });
                    }
                    else {
                        return "";
                    }
                })(this.state.id)));
        };
        return pickupComponent;
    }(React.Component));
};
