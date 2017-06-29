/// <amd-dependency path="esri/core/tsSupport/declareExtendsHelper" name="__extends" />
/// <amd-dependency path="esri/core/tsSupport/decorateHelper" name="__decorate" />

import {
  aliasOf,
  subclass,
  property,
  declared
} from "esri/core/accessorSupport/decorators";

import {
  tsx,
  renderable,
  accessibleHandler
} from "esri/widgets/support/widget";

import {
  DOWN_ARROW,
  LEFT_ARROW,
  RIGHT_ARROW,
  UP_ARROW,
} from "dojo/keys";

import watchUtils = require("esri/core/watchUtils");

import Widget = require("esri/widgets/Widget");
import MagnifierViewModel = require("./Magnifier/MagnifierViewModel");

import MapView = require("esri/views/MapView");
import SceneView = require("esri/views/SceneView");

import Layer = require("esri/layers/Layer");

import move = require("dojo/dnd/move");
import domGeometry = require("dojo/dom-geometry");

import ParentConstrainedMoveable = dojo.dnd.ParentConstrainedMoveable;

import * as i18n from "dojo/i18n!./Magnifier/nls/Magnifier";

const CSS = {
  base: "esri-magnifier esri-widget",
  handle: "esri-magnifier__handle",
  magnifierView: "esri-magnifier__view",
  magnifierViewHidden: "esri-magnifier__view--hidden"
};

const supportedKeys = [
  DOWN_ARROW,
  LEFT_ARROW,
  RIGHT_ARROW,
  UP_ARROW
];

@subclass("demo.Magnifier")
class Magnifier extends declared(Widget) {

  //--------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  //--------------------------------------------------------------------------

  postInitialize() {
    this.own([
      watchUtils.init(this, "viewModel.magnifierView", magnifierView => this._magnifierViewChange(magnifierView)),
      watchUtils.init(this, "viewModel.enabled", enabled => this._enabledChange(enabled)),
      watchUtils.on(this, "mover", "Move", (e: any, box: any, event: PointerEvent) => this._moverMoved(event))
    ]);
  }

  destroy() {
    this._destroyMover();
  }

  //--------------------------------------------------------------------------
  //
  //  Variables
  //
  //--------------------------------------------------------------------------

  _moverNode: HTMLElement = null;

  //--------------------------------------------------------------------------
  //
  //  Properties
  //
  //--------------------------------------------------------------------------

  //----------------------------------
  //  enabled
  //----------------------------------

  @aliasOf("viewModel.enabled")
  @renderable()
  enabled: boolean = null;

  //----------------------------------
  //  layer
  //----------------------------------

  @aliasOf("viewModel.layer")
  layer: Layer = null;

  //----------------------------------
  //  mover
  //----------------------------------

  @property({
    readOnly: true
  })
  mover: ParentConstrainedMoveable = null;

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
    return (
      <div afterCreate={this._setupMovable}
           afterUpdate={this._setupMovable}
           bind={this}
           class={CSS.base}>{
        this.enabled ?
          <div bind={this}
               class={CSS.handle}
               onkeydown={this._handleKeyDown}
               tabIndex={0} /> :
          null
      }</div>
    );
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _moverMoved(event: PointerEvent): void {
    if (!this._moverNode) {
      return;
    }

    // todo: not use dojo?
    const marginBox = domGeometry.getMarginBox(this._moverNode);
    this._updateClipPath(`${marginBox.l}px`, `${marginBox.t}px`);

    this.viewModel.updateView({
      x: event.clientX,
      y: event.clientY
    });
  }

  private _destroyMover(): void {
    if (!this.mover) {
      return;
    }

    this.mover.destroy();
    this._set("mover", null);
  }

  private _setupMovable(element: HTMLElement): void {
    if (this.mover) {
      return;
    }

    this._moverNode = element;

    this._set("mover", new move.parentConstrainedMoveable(element, {
      area: "content",
      within: true
    } as any));
  }

  private _enabledChange(enabled: boolean): void {
    const magViewNode = this.get<HTMLElement>("viewModel.magnifierView.container");

    if (!magViewNode) {
      return;
    }

    magViewNode.classList.toggle(CSS.magnifierViewHidden, !enabled);
  }

  private _updateClipPath(left: string, top: string): void {
    const magViewSurface = this.get<HTMLElement>("viewModel.magnifierView.surface");
    const clipPath = this.enabled ? `circle(150px at ${left} ${top})` : "none";

    magViewSurface.style.clipPath = clipPath;
  }

  private _magnifierViewChange(magView: MapView | SceneView): void {
    if (!magView) {
      return;
    }

    const magViewNode = magView.get<HTMLElement>("container");
    const viewNode = this.get<HTMLElement>("view.root");

    if (!viewNode) {
      return;
    }

    magViewNode.classList.add(CSS.magnifierView);
    this._enabledChange(this.enabled); // needed?
    viewNode.insertBefore(magViewNode, this.view.ui.container);
    this._updateClipPath("50%", "50%");
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    const { keyCode } = event;

    if (supportedKeys.indexOf(keyCode) === -1) {
      return;
    }

    if (keyCode === LEFT_ARROW) {
      // TODO: move left
    }

    if (keyCode === RIGHT_ARROW) {
      // TODO: move right
    }

    if (keyCode === DOWN_ARROW) {
      // TODO: move down
    }

    if (keyCode === UP_ARROW) {
      // TODO: move up
    }

    event.preventDefault();
    event.stopPropagation();
  }

}

export = Magnifier;
