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
define(["require", "exports", "esri/core/tsSupport/declareExtendsHelper", "esri/core/tsSupport/decorateHelper", "esri/core/accessorSupport/decorators", "esri/core/Accessor", "esri/core/watchUtils", "esri/Map", "esri/views/MapView", "esri/views/SceneView"], function (require, exports, __extends, __decorate, decorators_1, Accessor, watchUtils, Map, MapView, SceneView) {
    "use strict";
    var MagnifierViewModel = (function (_super) {
        __extends(MagnifierViewModel, _super);
        function MagnifierViewModel() {
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
        MagnifierViewModel.prototype.initialize = function () {
            var _this = this;
            this._handles.push(watchUtils.init(this, "view", function (view) { return _this._viewChange(view); }), watchUtils.init(this, "layer", function (newLayer, oldLayer) { return _this._layerChange(newLayer, oldLayer); }), watchUtils.init(this, "enabled", function (enabled) { return _this._enabledChange(enabled); }));
        };
        MagnifierViewModel.prototype.destroy = function () {
            this._handles.forEach(function (handle) { return handle.remove(); });
            this.magnifierView = null;
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        MagnifierViewModel.prototype.updateView = function (magnifyAt) {
            var magView = this.get("magnifierView");
            var view = this.get("view");
            if (!view || !magView) {
                return;
            }
            magView.center = view.toMap(magnifyAt);
        };
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
            console.log("view changed");
            this._removeViewpointHandle();
            if (!view) {
                this._set("magnifierView", null);
                return;
            }
            var components = [];
            var viewOptions = {
                container: document.createElement("div"),
                ui: { components: components },
                map: new Map()
            };
            this._createViewpointHandle(view);
            var magnifierView = view.type === "3d" ?
                new SceneView(viewOptions) :
                new MapView(viewOptions);
            magnifierView.get("surface").tabIndex = -1;
            this._set("magnifierView", magnifierView);
        };
        MagnifierViewModel.prototype._enabledChange = function (enabled) {
            console.log("enabled changed");
            var handle = this._viewpointHandle;
            if (!handle) {
                return;
            }
            enabled ?
                handle.resume() :
                handle.pause();
        };
        MagnifierViewModel.prototype._viewpointChange = function () {
            console.log("viewpoint changed");
            var magView = this.get("magnifierView");
            var view = this.get("view");
            if (!view || !magView) {
                return;
            }
            magView.set({
                scale: view.scale / 2,
                center: view.center
            });
        };
        MagnifierViewModel.prototype._layerChange = function (newLayer, oldLayer) {
            console.log("layer changed");
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