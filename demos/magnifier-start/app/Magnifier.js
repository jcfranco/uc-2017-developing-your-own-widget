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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "esri/widgets/Widget"], function (require, exports, __extends, __decorate, decorators_1, widget_1, Widget) {
    "use strict";
    //import * as i18n from "dojo/i18n!esri/widgets/Compass/nls/Compass";
    var CSS = {
        base: "esri-compass esri-widget-button esri-widget",
        text: "esri-icon-font-fallback-text",
        icon: "esri-compass__icon",
        rotationIcon: "esri-icon-dial",
        northIcon: "esri-icon-compass",
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
            _this.layer = null;
            //----------------------------------
            //  view
            //----------------------------------
            /**
             * The view in which the Compass obtains and indicates camera
             * {@link module:esri/Camera#heading heading}, using a (SceneView) or
             * {@link module:esri/views/Mapview#rotation rotation} (MapView).
             *
             * @name view
             * @instance
             * @type {module:esri/views/MapView | module:esri/views/SceneView}
             */
            _this.view = null;
            return _this;
        }
        Magnifier.prototype.postInitialize = function () { };
        //----------------------------------
        //  viewModel
        //----------------------------------
        // @property({
        //   type: CompassViewModel
        // })
        // @renderable([
        //   "viewModel.orientation",
        //   "viewModel.state"
        // ])
        // viewModel: CompassViewModel = new CompassViewModel();
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        Magnifier.prototype.render = function () {
            return (widget_1.tsx("div", null));
        };
        return Magnifier;
    }(decorators_1.declared(Widget)));
    __decorate([
        decorators_1.aliasOf("viewModel.layer")
    ], Magnifier.prototype, "layer", void 0);
    __decorate([
        decorators_1.aliasOf("viewModel.view")
    ], Magnifier.prototype, "view", void 0);
    Magnifier = __decorate([
        decorators_1.subclass("esri.widgets.Magnifier")
    ], Magnifier);
    return Magnifier;
});
//# sourceMappingURL=Magnifier.js.map