import { Game } from "../classes";

export default class State {
  static loadedGames: Game[] = [];
  static query: string | null = null;
  static filterText: string | null = null;

  // TODO - should get rid of this when pages become a thing
  static creatingAccount: boolean = false;
}
