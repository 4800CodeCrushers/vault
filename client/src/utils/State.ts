import { Game } from "../classes";

export default class State {
  static loadedGames: Game[] = [];
  static query: string | undefined;
}
