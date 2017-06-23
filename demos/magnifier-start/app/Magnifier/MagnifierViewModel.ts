import {
  aliasOf,
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";

import Accessor = require("esri/core/Accessor");
import promiseUtils = require("esri/core/promiseUtils");
import watchUtils = require("esri/core/watchUtils");

import Map = require("esri/Map");

import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import Layer = require("esri/layers/Layer");

@subclass("esri.demos.MagnifierViewModel")
class MagnifierViewModel extends declared(Accessor) {

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  initialize() {
    const map = new Map();

    const view = new MapView({
      container: document.createElement("div"),
      zoom: 14,
      center: [-116.51327133175782, 33.82029520464912],
      map: map
    });

    watchUtils.init(this, "layer", (newLayer, oldLayer) => this._layerChange(newLayer, oldLayer))
  }

  destroy() {
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  view
  //----------------------------------

  @property()
  view: MapView | SceneView;

  //--------------------------------------------------------------------------
  //
  //  Public Methods
  //
  //--------------------------------------------------------------------------


  private _layerChange(newLayer: Layer, oldLayer: Layer) {
    const map = this.get<Map>("view.map");

    if (!map) {
      return;
    }

    map.remove(oldLayer);
    map.add(newLayer);

  }

}

export = MagnifierViewModel;