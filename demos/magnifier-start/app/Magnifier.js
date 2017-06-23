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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "esri/widgets/Widget", "esri/widgets/Compass/CompassViewModel"], function (require, exports, __extends, __decorate, decorators_1, widget_1, Widget, CompassViewModel) {
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
    var Compass = (function (_super) {
        __extends(Compass, _super);
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        /**
         * @constructor
         * @alias module:esri/widgets/Compass
         * @extends module:esri/widgets/Widget
         * @param {Object} [properties] - See the [properties](#properties-summary) for a list of all the properties
         *                                that may be passed into the constructor.
         */
        function Compass(params) {
            var _this = _super.call(this) || this;
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
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
            //----------------------------------
            //  viewModel
            //----------------------------------
            /**
             * The view model for this widget. This is a class that contains all the logic
             * (properties and methods) that controls this widget's behavior. See the
             * {@link module:esri/widgets/Compass/CompassViewModel} class to access
             * all properties and methods on the widget.
             *
             * @name viewModel
             * @instance
             * @type {module:esri/widgets/Compass/CompassViewModel}
             * @autocast
             */
            _this.viewModel = new CompassViewModel();
            return _this;
        }
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        /**
         * If working in a {@link module:esri/views/MapView}, sets the view's
         * {@link module:esri/views/MapView#rotation rotation} to `0`. If working in a
         * {@link module:esri/views/SceneView}, sets the camera's
         * {@link module:esri/Camera#heading heading} to `0`. This method is executed each
         * time the {@link module:esri/widgets/Compass} is clicked.
         *
         * @method
         */
        Compass.prototype.reset = function () { };
        Compass.prototype.render = function () {
            var orientation = this.viewModel.orientation;
            var state = this.viewModel.state;
            var disabled = state === "disabled", showNorth = state === "rotation" ? "rotation" : "compass", // compass is also shown when disabled
            showingCompass = showNorth === "compass";
            var tabIndex = disabled ? -1 : 0;
            var dynamicRootClasses = (_a = {},
                _a[CSS.disabled] = disabled,
                _a[CSS.interactive] = !disabled,
                _a);
            var dynamicIconClasses = (_b = {},
                _b[CSS.northIcon] = showingCompass,
                _b[CSS.rotationIcon] = !showingCompass,
                _b);
            return;
            var _a, _b;
        };
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        Compass.prototype._reset = function () {
            this.reset();
        };
        Compass.prototype._toRotationTransform = function (orientation) {
            return {
                transform: "rotateZ(" + orientation.z + "deg)"
            };
        };
        return Compass;
    }(decorators_1.declared(Widget)));
    __decorate([
        decorators_1.aliasOf("viewModel.view")
    ], Compass.prototype, "view", void 0);
    __decorate([
        decorators_1.property({
            type: CompassViewModel
        }),
        widget_1.renderable([
            "viewModel.orientation",
            "viewModel.state"
        ])
    ], Compass.prototype, "viewModel", void 0);
    __decorate([
        decorators_1.aliasOf("viewModel.reset")
    ], Compass.prototype, "reset", null);
    __decorate([
        widget_1.accessibleHandler()
    ], Compass.prototype, "_reset", null);
    Compass = __decorate([
        decorators_1.subclass("esri.widgets.Compass")
    ], Compass);
    return Compass;
});
//# sourceMappingURL=Magnifier.js.map