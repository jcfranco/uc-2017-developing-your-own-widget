/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import {
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";

import Accessor = require("esri/core/Accessor");
import watchUtils = require("esri/core/watchUtils");

import Map = require("esri/Map");

import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import Layer = require("esri/layers/Layer");

interface PausableHandle extends IHandle {
  pause?(): void;
  resume?(): void;
}

@subclass("demo.MagnifierViewModel")
class MagnifierViewModel extends declared(Accessor) {

  //--------------------------------------------------------------------------
  //
  //  Private Variables
  //
  //--------------------------------------------------------------------------

  _handles: PausableHandle[] = [];

  _viewpointHandle: PausableHandle = null;

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  initialize() {
    const viewHandle = watchUtils.init(this, "view", view => this._viewChange(view));
    this._handles.push(viewHandle);

    const layerHandle = watchUtils.init(this, "layer", (newLayer, oldLayer) => this._layerChange(newLayer, oldLayer));
    this._handles.push(layerHandle);

    const enabledHandle = watchUtils.init(this, "enabled", enabled => this._enabledChange(enabled));
    this._handles.push(enabledHandle);
  }

  destroy() {
    this._handles.forEach(handle => {
      handle.remove();
    });

    this.magnifierView = null;
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  enabled
  //----------------------------------

  @property()
  enabled = true;

  //----------------------------------
  //  layer
  //----------------------------------

  @property()
  layer: Layer = null;

  //----------------------------------
  //  magnifierView
  //----------------------------------

  @property({
    readOnly: true
  })
  magnifierView: MapView | SceneView = null;

  //----------------------------------
  //  view
  //----------------------------------

  @property()
  view: MapView | SceneView = null;

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

  private _removeViewpointHandle(): void {
    if (!this._viewpointHandle) {
      return;
    }

    this._viewpointHandle.remove();
    this._viewpointHandle = null;
  }

  private _createViewpointHandle(view: MapView | SceneView) {
    if (!view) {
      return;
    }

    const is3dView = view.type === "3d";
    const viewpointProp = is3dView ? "camera" : "viewpoint";
    this._viewpointHandle = watchUtils.pausable(view, viewpointProp, () => this._viewpointChange());
    this._handles.push(this._viewpointHandle);

    this._enabledChange(this.enabled);
  }

  private _viewChange(view: MapView | SceneView): void {
    this._removeViewpointHandle();

    if (!view) {
      this._set("magnifierView", undefined);
      return;
    }

    const components: string[] = [];

    const viewOptions = {
      container: document.createElement("div"),
      ui: {
        components: components
      },
      map: new Map()
    }

    const is3dView = view.type === "3d";
    this._createViewpointHandle(view);

    const magnifierView = is3dView ?
      new SceneView(viewOptions) :
      new MapView(viewOptions);

    this._set("magnifierView", magnifierView);
  }

  private _enabledChange(enabled: boolean): void {
    if (!this._viewpointHandle) {
      return;
    }

    enabled ? this._viewpointHandle.resume() : this._viewpointHandle.pause();
  }

  private _viewpointChange(): void {
    const magView = this.get<MapView | SceneView>("magnifierView");
    const view = this.get<MapView | SceneView>("view");

    if (!view || !magView) {
      return;
    }

    magView.zoom = view.zoom + 1;
    //magView.scale = view.scale; // todo: figure out what to do here
    magView.center = view.center;
  }

  private _layerChange(newLayer: Layer, oldLayer: Layer): void {
    const map = this.get<Map>("magnifierView.map");

    if (!map) {
      return;
    }

    if (oldLayer) {
      map.remove(oldLayer);
    }

    if (newLayer) {
      map.add(newLayer);
    }
  }

}

export = MagnifierViewModel;