/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "dojo/keys", "esri/core/watchUtils", "esri/widgets/Widget", "./Magnifier/MagnifierViewModel", "dojo/dnd/move", "dojo/dom-geometry", "dojo/i18n!./Magnifier/nls/Magnifier"], function (require, exports, __extends, __decorate, decorators_1, widget_1, keys_1, watchUtils, Widget, MagnifierViewModel, move, domGeometry, i18n) {
    "use strict";
    var CSS = {
        base: "esri-magnifier esri-widget",
        handle: "esri-magnifier__handle",
        magnifierView: "esri-magnifier__view",
        magnifierViewHidden: "esri-magnifier__view--hidden"
    };
    var supportedKeys = [
        keys_1.DOWN_ARROW,
        keys_1.LEFT_ARROW,
        keys_1.RIGHT_ARROW,
        keys_1.UP_ARROW
    ];
    var Magnifier = (function (_super) {
        __extends(Magnifier, _super);
        function Magnifier() {
            //--------------------------------------------------------------------------
            //
            //  Lifecycle
            //
            //--------------------------------------------------------------------------
            var _this = _super.apply(this, arguments) || this;
            //--------------------------------------------------------------------------
            //
            //  Variables
            //
            //--------------------------------------------------------------------------
            _this._moverNode = null;
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  enabled
            //----------------------------------
            _this.enabled = null;
            //----------------------------------
            //  layer
            //----------------------------------
            _this.layer = null;
            //----------------------------------
            //  mover
            //----------------------------------
            _this.mover = null;
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            //----------------------------------
            //  viewModel
            //----------------------------------
            _this.viewModel = new MagnifierViewModel();
            return _this;
        }
        Magnifier.prototype.postInitialize = function () {
            var _this = this;
            this.own([
                watchUtils.init(this, "viewModel.magnifierView", function (magnifierView) { return _this._magnifierViewChange(magnifierView); }),
                watchUtils.init(this, "viewModel.enabled", function (enabled) { return _this._enabledChange(enabled); }),
                // todo: should we not recenter? couldn't get mover to update clip right.
                watchUtils.watch(this, "view.size", function () { return _this.center(); }),
                watchUtils.on(this, "mover", "Move", function () { return _this._moverMoved(); })
            ]);
        };
        Magnifier.prototype.destroy = function () {
            this._destroyMover();
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        Magnifier.prototype.render = function () {
            var handle = this.enabled ? (widget_1.tsx("div", { bind: this, "aria-label": i18n.keyboardHelp, class: CSS.handle, onkeydown: this._handleKeyDown, tabIndex: 0, title: i18n.dragHelp })) : null;
            return (widget_1.tsx("div", { afterCreate: this._setupMovable, afterUpdate: this._setupMovable, bind: this, class: CSS.base }, handle));
        };
        Magnifier.prototype.center = function () {
            if (!this._moverNode || !this.view) {
                return;
            }
            var _a = this.view, width = _a.width, height = _a.height;
            var left = width / 2 + "px";
            var top = height / 2 + "px";
            this._moverNode.style.left = left;
            this._moverNode.style.top = top;
            this._moverMoved();
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        Magnifier.prototype._moverMoved = function () {
            if (!this._moverNode) {
                return;
            }
            // todo: not use dojo?
            var marginBox = domGeometry.getMarginBox(this._moverNode);
            var _a = domGeometry.position(this._moverNode), x = _a.x, y = _a.y;
            this._updateClipPath(marginBox.l + "px", marginBox.t + "px");
            this.viewModel.updateView({ x: x, y: y });
        };
        Magnifier.prototype._destroyMover = function () {
            if (!this.mover) {
                return;
            }
            this.mover.destroy();
            this._set("mover", null);
        };
        Magnifier.prototype._setupMovable = function (element) {
            if (this.mover) {
                return;
            }
            this._moverNode = element;
            this.center();
            this._set("mover", new move.parentConstrainedMoveable(element, {
                area: "content",
                within: true
            }));
        };
        Magnifier.prototype._enabledChange = function (enabled) {
            var magViewNode = this.get("viewModel.magnifierView.container");
            if (!magViewNode) {
                return;
            }
            magViewNode.classList.toggle(CSS.magnifierViewHidden, !enabled);
        };
        Magnifier.prototype._updateClipPath = function (left, top) {
            var magViewSurface = this.get("viewModel.magnifierView.surface");
            var handleNode = this._moverNode.children[0];
            var handleWidth = domGeometry.position(handleNode).w;
            var clipRadius = handleWidth / 2;
            var clipPath = this.enabled ? "circle(" + clipRadius + "px at " + left + " " + top + ")" : "none";
            magViewSurface.style.clipPath = clipPath;
        };
        Magnifier.prototype._magnifierViewChange = function (magView) {
            if (!magView) {
                return;
            }
            var magViewNode = magView.get("container");
            var viewNode = this.get("view.root");
            if (!viewNode) {
                return;
            }
            magViewNode.classList.add(CSS.magnifierView);
            this._enabledChange(this.enabled); // needed?
            viewNode.insertBefore(magViewNode, this.view.ui.container);
            this.center();
        };
        Magnifier.prototype._handleKeyDown = function (event) {
            var keyCode = event.keyCode, shiftKey = event.shiftKey;
            if (supportedKeys.indexOf(keyCode) === -1) {
                return;
            }
            var style = this._moverNode.style;
            var offsetInPx = shiftKey ? 25 : 10;
            if (keyCode === keys_1.LEFT_ARROW || keyCode === keys_1.RIGHT_ARROW) {
                var left = parseInt(style.left) || 0;
                var nudgeAmount = keyCode === keys_1.RIGHT_ARROW ? offsetInPx : -offsetInPx;
                style.left = left + nudgeAmount + "px";
            }
            if (keyCode === keys_1.DOWN_ARROW || keyCode === keys_1.UP_ARROW) {
                var top_1 = parseInt(style.top) || 0;
                var nudgeAmount = keyCode === keys_1.DOWN_ARROW ? offsetInPx : -offsetInPx;
                style.top = top_1 + nudgeAmount + "px";
            }
            this._moverMoved();
            event.preventDefault();
            event.stopPropagation();
        };
        return Magnifier;
    }(decorators_1.declared(Widget)));
    __decorate([
        decorators_1.aliasOf("viewModel.enabled"),
        widget_1.renderable()
    ], Magnifier.prototype, "enabled", void 0);
    __decorate([
        decorators_1.aliasOf("viewModel.layer")
    ], Magnifier.prototype, "layer", void 0);
    __decorate([
        decorators_1.property({
            readOnly: true
        })
    ], Magnifier.prototype, "mover", void 0);
    __decorate([
        decorators_1.aliasOf("viewModel.view")
    ], Magnifier.prototype, "view", void 0);
    __decorate([
        decorators_1.property({
            type: MagnifierViewModel
        }),
        widget_1.renderable([
            "viewModel.magnifierView"
        ])
    ], Magnifier.prototype, "viewModel", void 0);
    Magnifier = __decorate([
        decorators_1.subclass("demo.Magnifier")
    ], Magnifier);
    return Magnifier;
});
//# sourceMappingURL=Magnifier.js.map