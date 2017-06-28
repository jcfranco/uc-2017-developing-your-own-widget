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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "esri/core/watchUtils", "esri/widgets/Widget", "./Magnifier/MagnifierViewModel", "dojo/dnd/move", "dojo/dom-geometry"], function (require, exports, __extends, __decorate, decorators_1, widget_1, watchUtils, Widget, MagnifierViewModel, move, domGeometry) {
    "use strict";
    // todo
    //import * as i18n from "dojo/i18n!esri/widgets/Compass/nls/Compass";
    var CSS = {
        base: "esri-magnifier esri-widget",
        handle: "esri-magnifier__handle",
        magnifierView: "esri-magnifier__view",
        magnifierViewHidden: "esri-magnifier__view--hidden"
    };
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
                watchUtils.on(this, "mover", "Move", function (e, box, event) { return _this._moverMoved(event); })
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
            return (widget_1.tsx("div", { afterCreate: this._setupMovable, afterUpdate: this._setupMovable, bind: this, class: CSS.base }, this.enabled ? widget_1.tsx("div", { class: CSS.handle }) : null));
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        Magnifier.prototype._moverMoved = function (event) {
            if (!this._moverNode) {
                return;
            }
            // todo: not use dojo?
            var marginBox = domGeometry.getMarginBox(this._moverNode);
            this._updateClipPath(marginBox.l + "px", marginBox.t + "px");
            this.viewModel.updateView({
                x: event.clientX,
                y: event.clientY
            });
        };
        Magnifier.prototype._destroyMover = function () {
            if (!this.mover) {
                return;
            }
            this.mover.destroy();
            this._set("mover", null);
        };
        Magnifier.prototype._setupMovable = function (element) {
            this._destroyMover();
            this._moverNode = element;
            this._set("mover", new move.parentConstrainedMoveable(element, {
                area: "content",
                within: true
            }));
            element.style.left = "50%";
            element.style.top = "50%";
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
            var clipPath = this.enabled ? "circle(150px at " + left + " " + top + ")" : "none";
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
            this._updateClipPath("50%", "50%");
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