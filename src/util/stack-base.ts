export default class StackBase<T> {
  private stack: T[] = [];

  get read() {
    return this.stack;
  }

  get peak() {
    return this.stack[this.stack.length - 1];
  }

  add(element: T) {
    this.stack.push(element);
  }

  remove(): T | [] {
    if (this.isEmpty()) {
      return [];
    }
    return this.stack.pop()!;
  }

  isEmpty(): boolean {
    return this.stack.length === 0 || this.stack === undefined;
  }
}
