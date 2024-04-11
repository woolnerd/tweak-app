type FixtureId = number;
type Directive = string;
//this will be only specific labels from control panel

export default class CommandLine {
  protected directives: Directive[];

  protected subscribers: FixtureId[];

  public add(directive: string) {
    this.directives.push(directive);
  }

  public execute() {
    //send the directives to the subscribers
    //ie "Channels 1-3 @ 50";
  }
}
