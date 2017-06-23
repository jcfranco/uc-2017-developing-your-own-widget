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
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/core/Accessor", "esri/core/watchUtils"], function (require, exports, decorators_1, Accessor, watchUtils) {
    "use strict";
    var MagnifierViewModel = (function (_super) {
        __extends(MagnifierViewModel, _super);
        function MagnifierViewModel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        //--------------------------------------------------------------------------
        //
        //  Lifecycle
        //
        //--------------------------------------------------------------------------
        MagnifierViewModel.prototype.initialize = function () {
            var _this = this;
            watchUtils.init(this, "layer", function (newLayer, oldLayer) { return _this._layerChange(newLayer, oldLayer); });
        };
        MagnifierViewModel.prototype.destroy = function () {
        };
        //--------------------------------------------------------------------------
        //
        //  Public Methods
        //
        //--------------------------------------------------------------------------
        MagnifierViewModel.prototype._layerChange = function (newLayer, oldLayer) {
            var map = this.get("view.map");
            if (!map) {
                return;
            }
            map.remove(oldLayer);
            map.add(newLayer);
        };
        return MagnifierViewModel;
    }(decorators_1.declared(Accessor)));
    __decorate([
        decorators_1.property()
    ], MagnifierViewModel.prototype, "view", void 0);
    MagnifierViewModel = __decorate([
        decorators_1.subclass("esri.demos.MagnifierViewModel")
    ], MagnifierViewModel);
    return MagnifierViewModel;
});
//# sourceMappingURL=MagnifierViewModel.js.map