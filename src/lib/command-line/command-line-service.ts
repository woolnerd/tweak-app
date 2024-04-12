import { ActionObject } from "./types/command-line-types.ts";
import ProfileAdapter from "../adapters/profile-adapter.ts";
import HistoryStack from "../history-stack.ts";

export default class CommandLineService {
  commandEvents: string[];

  errors: string[];

  action: ActionObject;

  profileAdapter: ProfileAdapter;

  history: HistoryStack;

  buildAction(): void {
    const action: ActionObject = {};
    // eslint-disable-next-line spaced-comment
    //do stuff;
    this.action = action;
  }

  checkUndoEvent(): boolean {
    return (
      this.commandEvents.filter((event) => event.toLowerCase().match("undo"))
        .length > 0
    );
  }

  adaptProfile(): void {
    this.profileAdapter.parse(this.commandEvents);
  }

  addToHistory(): void {
    this.history.add(this.commandEvents);
  }
}
