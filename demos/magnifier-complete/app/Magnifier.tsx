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
      watchUtils.on(this, "mover", "Move", () => this._moverMoved())
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
    const handle = this.enabled ? (
      <div bind={this}
        aria-label={i18n.keyboardHelp}
        class={CSS.handle}
        onkeydown={this._handleKeyDown}
        tabIndex={0}
        title={i18n.dragHelp} />
    ) : null;

    return (
      <div afterCreate={this._setupMovable}
        afterUpdate={this._setupMovable}
        bind={this}
        class={CSS.base}>{handle}</div>
    );
  }

  center(): void {
    if (!this._moverNode || !this.view) {
      return;
    }

    const { width, height } = this.view;
    const left = `${width / 2}px`;
    const top = `${height / 2}px`;

    this._moverNode.style.left = left;
    this._moverNode.style.top = top;

    this._moverMoved();
  }

  //--------------------------------------------------------------------------
  //
  //  Private Methods
  //
  //--------------------------------------------------------------------------

  private _moverMoved(): void {
    if (!this._moverNode) {
      return;
    }

    const marginBox = domGeometry.getMarginBox(this._moverNode);
    const { x, y } = domGeometry.position(this._moverNode);

    this._updateClipPath(`${marginBox.l}px`, `${marginBox.t}px`);

    this.viewModel.updateView({ x, y });
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

    this.center();

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
    const handleNode = this._moverNode.children[0];
    const { w: handleWidth } = domGeometry.position(handleNode);
    const clipRadius = handleWidth / 2;
    const clipPath = this.enabled ? `circle(${clipRadius}px at ${left} ${top})` : "none";

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
    this._enabledChange(this.enabled);
    viewNode.insertBefore(magViewNode, this.view.ui.container);
    this.center();
  }

  private _handleKeyDown(event: KeyboardEvent): void {
    const { keyCode, shiftKey } = event;

    if (supportedKeys.indexOf(keyCode) === -1) {
      return;
    }

    const { style } = this._moverNode;
    const offsetInPx = shiftKey ? 25 : 10;

    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
      const left = parseInt(style.left) || 0;
      const nudgeAmount = keyCode === RIGHT_ARROW ? offsetInPx : -offsetInPx;

      style.left = `${left + nudgeAmount}px`;
    }

    if (keyCode === DOWN_ARROW || keyCode === UP_ARROW) {
      const top = parseInt(style.top) || 0;
      const nudgeAmount = keyCode === DOWN_ARROW ? offsetInPx : -offsetInPx;

      style.top = `${top + nudgeAmount}px`;
    }

    this._moverMoved();

    event.preventDefault();
    event.stopPropagation();
  }

}

export = Magnifier;
