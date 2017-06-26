/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "esri/core/watchUtils", "esri/widgets/Widget", "./Magnifier/MagnifierViewModel"], function (require, exports, __extends, __decorate, decorators_1, widget_1, watchUtils, Widget, MagnifierViewModel) {
    "use strict";
    // todo
    //import * as i18n from "dojo/i18n!esri/widgets/Compass/nls/Compass";
    var CSS = {
        base: "esri-magnifier esri-widget",
        magnifierView: "esri-magnifier-view",
        // common
        interactive: "esri-interactive",
        disabled: "esri-disabled"
    };
    var Magnifier = (function (_super) {
        __extends(Magnifier, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        function Magnifier(params) {
            var _this = _super.call(this) || this;
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
                watchUtils.init(this, "viewModel.magnifierView", function (magnifierView) { return _this._magnifierViewChange(magnifierView); })
            ]);
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        Magnifier.prototype.render = function () {
            return (widget_1.tsx("div", null));
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
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
            viewNode.insertBefore(magViewNode, this.view.ui.container);
            var magViewSurface = magView.get("surface");
            var clipPath = this.enabled ? "circle(150px at 50% 50%)" : "none";
            magViewSurface.style.clipPath = clipPath;
        };
        return Magnifier;
    }(decorators_1.declared(Widget)));
    __decorate([
        decorators_1.aliasOf("viewModel.enabled")
    ], Magnifier.prototype, "enabled", void 0);
    __decorate([
        decorators_1.aliasOf("viewModel.layer")
    ], Magnifier.prototype, "layer", void 0);
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