/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { aliasOf, subclass, property, declared } from "esri/core/accessorSupport/decorators";

import {
  tsx,
  renderable,
  accessibleHandler
} from "esri/widgets/support/widget";

//import { Axes } from "esri/widgets/interfaces";

import watchUtils = require("esri/core/watchUtils");

import Widget = require("esri/widgets/Widget");
import MagnifierViewModel = require("./Magnifier/MagnifierViewModel");

import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import Layer = require("esri/layers/Layer");

// todo
//import * as i18n from "dojo/i18n!esri/widgets/Compass/nls/Compass";

const CSS = {
  base: "esri-magnifier esri-widget",
  magnifierView: "esri-magnifier-view",

  // common
  interactive: "esri-interactive",
  disabled: "esri-disabled"
};

@subclass("demo.Magnifier")
class Magnifier extends declared(Widget) {

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  constructor(params?: any) {
    super();
  }

  postInitialize() {
    this.own([
      watchUtils.init(this, "viewModel.magnifierView", magnifierView => this._magnifierViewChange(magnifierView))
    ]);
  }

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  enabled
  //----------------------------------
  @aliasOf("viewModel.enabled")
  enabled: boolean = null;

  //----------------------------------
  //  layer
  //----------------------------------
  @aliasOf("viewModel.layer")
  layer: Layer = null;

  //----------------------------------
  //  view
  //----------------------------------

  @aliasOf("viewModel.view")
  view: MapView | SceneView = null;

  //----------------------------------
  //  viewModel
  //----------------------------------

  @property({
    type: MagnifierViewModel
  })
  @renderable([
    "viewModel.magnifierView"
  ])
  viewModel: MagnifierViewModel = new MagnifierViewModel();

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

  _magnifierViewChange(magView: MapView | SceneView) {
    if (!magView) {
      return;
    }

    const magViewNode = magView.get<HTMLElement>("container");
    const viewNode = this.get<HTMLElement>("view.root");

    if (!viewNode) {
      return;
    }

    magViewNode.classList.add(CSS.magnifierView);
    viewNode.insertBefore(magViewNode, this.view.ui.container);

    const magViewSurface = magView.get<HTMLElement>("surface");
    const clipPath = this.enabled ? "circle(150px at 50% 50%)" : "none";
    magViewSurface.style.clipPath = clipPath;
  }
}

export = Magnifier;
