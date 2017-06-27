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
  handle: "esri-magnifier__handle",
  magnifierView: "esri-magnifier__view",
  magnifierViewHidden: "esri-magnifier__view--hidden"
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
      watchUtils.init(this, "viewModel.magnifierView", magnifierView => this._magnifierViewChange(magnifierView)),
      watchUtils.init(this, "viewModel.enabled", enabled => this._enabledChange(enabled))
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
  @renderable()
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

  render(): any {
    const handleNode = this.enabled ? (
      <div class={CSS.handle}></div>
    ) : null;

    const containerNode = (
      <div class={CSS.base}>{handleNode}</div>
    );

    return containerNode;
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  _enabledChange(enabled: boolean) : void {
    const magViewNode = this.get<HTMLElement>("viewModel.magnifierView.container");

    if (!magViewNode) {
      return;
    }
    
    !enabled ?
      magViewNode.classList.add(CSS.magnifierViewHidden) :
      magViewNode.classList.remove(CSS.magnifierViewHidden);
  }

  _magnifierViewChange(magView: MapView | SceneView): void {
    if (!magView) {
      return;
    }

    const magViewNode = magView.get<HTMLElement>("container");
    const viewNode = this.get<HTMLElement>("view.root");

    if (!viewNode) {
      return;
    }

    magViewNode.classList.add(CSS.magnifierView);
    this._enabledChange(this.enabled);
    viewNode.insertBefore(magViewNode, this.view.ui.container);

    const magViewSurface = magView.get<HTMLElement>("surface");
    const clipPath = this.enabled ? "circle(150px at 50% 50%)" : "none";
    magViewSurface.style.clipPath = clipPath;
  }
}

export = Magnifier;
