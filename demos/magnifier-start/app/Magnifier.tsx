/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { aliasOf, subclass, property, declared } from "esri/core/accessorSupport/decorators";

import {
  tsx,
  renderable,
  accessibleHandler
} from "esri/widgets/support/widget";

//import { Axes } from "esri/widgets/interfaces";

import Widget = require("esri/widgets/Widget");
//import MagnifierViewModel = require("esri/widgets/Magnifier/MagnifierViewModel");
import View = require("esri/views/View");

import Layer = require("esri/layers/Layer");

//import * as i18n from "dojo/i18n!esri/widgets/Compass/nls/Compass";

const CSS = {
  base: "esri-compass esri-widget-button esri-widget",
  text: "esri-icon-font-fallback-text",
  icon: "esri-compass__icon",
  rotationIcon: "esri-icon-dial",
  northIcon: "esri-icon-compass",

  // common
  interactive: "esri-interactive",
  disabled: "esri-disabled"
};

@subclass("esri.widgets.Magnifier")
class Magnifier extends declared(Widget) {

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(params?: any) {
    super();
  }

  postInitialize(){}

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  @aliasOf("viewModel.layer")
  layer: Layer = null;

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
  @aliasOf("viewModel.view")
  view: View = null;

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

  render() {
    return (<div />);
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  // @accessibleHandler()
  // private _reset() {
  //   this.reset();
  // }

  // private _toRotationTransform(orientation: Axes): TransformStyle {
  //   return {
  //     transform: `rotateZ(${orientation.z}deg)`
  //   };
  // }

}

export = Magnifier;
