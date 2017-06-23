/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import { aliasOf, subclass, property, declared } from "esri/core/accessorSupport/decorators";

import {
  jsxFactory,
  renderable,
  accessibleHandler
} from "esri/widgets/support/widget";

//import { Axes } from "esri/widgets/interfaces";

interface Axes {
  x?: number;
  y?: number;
  z?: number;
}

import Widget = require("esri/widgets/Widget");
import CompassViewModel = require("esri/widgets/Compass/CompassViewModel");
import View = require("esri/views/View");

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

interface TransformStyle {
  transform: string;
}

@subclass("esri.widgets.Compass")
class Compass extends declared(Widget) {

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
  constructor(params?: any) {
    super();
  }

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
  @aliasOf("viewModel.view")
  view: View = null;

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
  @property({
    type: CompassViewModel
  })
  @renderable([
    "viewModel.orientation",
    "viewModel.state"
  ])
  viewModel: CompassViewModel = new CompassViewModel();

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
  @aliasOf("viewModel.reset")
  reset(): void { }

  render() {
    const orientation = this.viewModel.orientation;
    const state = this.viewModel.state;

    const disabled = state === "disabled",
      showNorth = state === "rotation" ? "rotation" : "compass", // compass is also shown when disabled
      showingCompass = showNorth === "compass";

    const tabIndex = disabled ? -1 : 0;

    const dynamicRootClasses = {
      [CSS.disabled]: disabled,
      [CSS.interactive]: !disabled
    };

    const dynamicIconClasses = {
      [CSS.northIcon]: showingCompass,
      [CSS.rotationIcon]: !showingCompass
    };

    return (
      <div bind={this}
        class={CSS.base}
        classes={dynamicRootClasses}
        onclick={this._reset}
        onkeydown={this._reset}
        role="button"
        tabIndex={tabIndex}>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  @accessibleHandler()
  private _reset() {
    this.reset();
  }

  private _toRotationTransform(orientation: Axes): TransformStyle {
    return {
      transform: `rotateZ(${orientation.z}deg)`
    };
  }

}

export = Compass;
