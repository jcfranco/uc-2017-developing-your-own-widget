// remove dojo/dnd/move typings when https://github.com/dojo/typings/pull/125 is merged

declare module "dojo/dnd/move" {
  const Move: dojo.dnd.Move;
  export = Move;
}

declare namespace dojo {

  namespace dnd {

    interface Move {
      constrainedMoveable: ConstrainedMoveableConstructor;
      boxConstrainedMoveable: BoxConstrainedMoveableConstructor;
      parentConstrainedMoveable: ParentConstrainedMoveableConstructor;
    }

    interface ConstrainedMoveable extends Moveable {
      constraints: () => DomGeometryBox;
      within: boolean;
    }

    interface ConstrainedMoveableConstructor {
      new (node: NodeOrString, params?: ConstrainedMoveableArgs): ConstrainedMoveable;
    }

    interface ConstrainedMoveableArgs extends MoveableArgs {
      constraints?: () => DomGeometryBox;
      within?: boolean;
    }

    interface BoxConstrainedMoveable extends ConstrainedMoveable {
      box: DomGeometryBox;
    }

    interface BoxConstrainedMoveableConstructor {
      new (node: NodeOrString, params?: BoxConstrainedMoveableArgs): BoxConstrainedMoveable;
    }

    interface BoxConstrainedMoveableArgs extends ConstrainedMoveableArgs {
      box?: DomGeometryBox;
    }

    type Area = "border" |  "content" | "margin" | "padding";

    interface ParentConstrainedMoveable extends ConstrainedMoveable {
      area: Area;
    }

    interface ParentConstrainedMoveableConstructor {
      new (node: NodeOrString, params?: ParentConstrainedMoveableArgs): ParentConstrainedMoveable;
    }

    interface ParentConstrainedMoveableArgs extends ConstrainedMoveableArgs {
      area?: Area;
    }

  }

}
