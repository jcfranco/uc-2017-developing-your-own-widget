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

type ScreenPoint = { x: number, y: number };

interface PausableHandle extends IHandle {
  pause?(): void;
  resume?(): void;
}

@subclass("demo.MagnifierViewModel")
class MagnifierViewModel extends declared(Accessor) {

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  initialize() {
    this._handles.push(
      watchUtils.init(this, "view", view => this._viewChange(view)),
      watchUtils.init(this, "layer", (newLayer, oldLayer) => this._layerChange(newLayer, oldLayer)),
      watchUtils.init(this, "enabled", enabled => this._enabledChange(enabled))
    );
  }


  destroy() {
    this._handles.forEach(handle => handle.remove());

    this.magnifierView = null;
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  _handles: PausableHandle[] = [];

  _viewpointHandle: PausableHandle = null;

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

  updateView(magnifyAt: ScreenPoint): void {
    const magView = this.get<MapView | SceneView>("magnifierView");
    const view = this.get<MapView | SceneView>("view");

    if (!view || !magView) {
      return;
    }

    magView.center = view.toMap(magnifyAt);
  }

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

  private _createViewpointHandle(view: MapView | SceneView): void {
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
      this._set("magnifierView", null);
      return;
    }

    const components: string[] = [];
    const viewOptions = {
      container: document.createElement("div"),
      ui: { components },
      map: new Map()
    };

    this._createViewpointHandle(view);

    const magnifierView = view.type === "3d" ?
      new SceneView(viewOptions) :
      new MapView(viewOptions);

    (magnifierView.get("surface") as HTMLElement).tabIndex = -1;

    this._set("magnifierView", magnifierView);
  }

  private _enabledChange(enabled: boolean): void {
    const handle = this._viewpointHandle;
    if (!handle) {
      return;
    }

    enabled ?
      handle.resume() :
      handle.pause();
  }

  private _viewpointChange(): void {
    const magView = this.get<MapView | SceneView>("magnifierView");
    const view = this.get<MapView | SceneView>("view");

    if (!view || !magView) {
      return;
    }

    magView.set({
      scale: view.scale / 2,
      center: view.center
    });
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
