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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/core/Accessor", "esri/core/watchUtils", "esri/Map", "esri/views/MapView", "esri/views/SceneView"], function (require, exports, __extends, __decorate, decorators_1, Accessor, watchUtils, Map, MapView, SceneView) {
    "use strict";
    var MagnifierViewModel = (function (_super) {
        __extends(MagnifierViewModel, _super);
        function MagnifierViewModel() {
            //--------------------------------------------------------------------------
            //
            //  Private Variables
            //
            //--------------------------------------------------------------------------
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this._handles = [];
            _this._viewpointHandle = null;
            //--------------------------------------------------------------------------
            //
            //  Properties
            //
            //--------------------------------------------------------------------------
            //----------------------------------
            //  enabled
            //----------------------------------
            _this.enabled = true;
            //----------------------------------
            //  layer
            //----------------------------------
            _this.layer = null;
            //----------------------------------
            //  magnifierView
            //----------------------------------
            _this.magnifierView = null;
            //----------------------------------
            //  view
            //----------------------------------
            _this.view = null;
            return _this;
        }
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        MagnifierViewModel.prototype.initialize = function () {
            var _this = this;
            var viewHandle = watchUtils.init(this, "view", function (view) { return _this._viewChange(view); });
            this._handles.push(viewHandle);
            var layerHandle = watchUtils.init(this, "layer", function (newLayer, oldLayer) { return _this._layerChange(newLayer, oldLayer); });
            this._handles.push(layerHandle);
            var enabledHandle = watchUtils.init(this, "enabled", function (enabled) { return _this._enabledChange(enabled); });
            this._handles.push(enabledHandle);
        };
        MagnifierViewModel.prototype.destroy = function () {
            this._handles.forEach(function (handle) {
                handle.remove();
            });
            this.magnifierView = null;
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        // todo?
        //--------------------------------------------------------------------------
        //
        //  Private Methods
        //
        //--------------------------------------------------------------------------
        MagnifierViewModel.prototype._removeViewpointHandle = function () {
            if (!this._viewpointHandle) {
                return;
            }
            this._viewpointHandle.remove();
            this._viewpointHandle = null;
        };
        MagnifierViewModel.prototype._createViewpointHandle = function (view) {
            var _this = this;
            if (!view) {
                return;
            }
            var is3dView = view.type === "3d";
            var viewpointProp = is3dView ? "camera" : "viewpoint";
            this._viewpointHandle = watchUtils.pausable(view, viewpointProp, function () { return _this._viewpointChange(); });
            this._handles.push(this._viewpointHandle);
            this._enabledChange(this.enabled);
        };
        MagnifierViewModel.prototype._viewChange = function (view) {
            this._removeViewpointHandle();
            if (!view) {
                this._set("magnifierView", undefined);
                return;
            }
            var components = [];
            var viewOptions = {
                container: document.createElement("div"),
                popup: false,
                ui: {
                    components: components
                },
                map: new Map()
            };
            var is3dView = view.type === "3d";
            this._createViewpointHandle(view);
            var magnifierView = is3dView ?
                new SceneView(viewOptions) :
                new MapView(viewOptions);
            this._set("magnifierView", magnifierView);
        };
        MagnifierViewModel.prototype._enabledChange = function (enabled) {
            if (!this._viewpointHandle) {
                return;
            }
            enabled ? this._viewpointHandle.resume() : this._viewpointHandle.pause();
        };
        MagnifierViewModel.prototype._viewpointChange = function () {
            var magView = this.get("magnifierView");
            var view = this.get("view");
            if (!view || !magView) {
                return;
            }
            magView.scale = view.scale; // todo: figure out what to do here
            magView.center = view.center;
        };
        MagnifierViewModel.prototype._layerChange = function (newLayer, oldLayer) {
            var map = this.get("magnifierView.map");
            if (!map) {
                return;
            }
            if (oldLayer) {
                map.remove(oldLayer);
            }
            if (newLayer) {
                map.add(newLayer);
            }
        };
        return MagnifierViewModel;
    }(decorators_1.declared(Accessor)));
    __decorate([
        decorators_1.property()
    ], MagnifierViewModel.prototype, "enabled", void 0);
    __decorate([
        decorators_1.property()
    ], MagnifierViewModel.prototype, "layer", void 0);
    __decorate([
        decorators_1.property({
            readOnly: true
        })
    ], MagnifierViewModel.prototype, "magnifierView", void 0);
    __decorate([
        decorators_1.property()
    ], MagnifierViewModel.prototype, "view", void 0);
    MagnifierViewModel = __decorate([
        decorators_1.subclass("demo.MagnifierViewModel")
    ], MagnifierViewModel);
    return MagnifierViewModel;
});
//# sourceMappingURL=MagnifierViewModel.js.map