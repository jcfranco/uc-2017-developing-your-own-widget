type PresenterName = "Matt" | "JC";

interface Person {
  name: string;
}

interface Presenter extends Person {
  name: PresenterName;
}

const examplePresenter: Presenter = { name: "Alan" };

