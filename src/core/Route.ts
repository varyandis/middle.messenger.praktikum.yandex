import type { Block } from "./Block";
import { render } from "./renderDOM";

type BlockClass = new () => Block;

type RouteProps = {
  rootQuery: string;
};

export class Route {
  private _pathname: string;
  private _blockClass: BlockClass;
  private _block: Block | null = null;
  private _props: RouteProps;

  constructor(pathname: string, view: BlockClass, props: RouteProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._props = props;
  }

  public navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  public leave(): void {
    if (this._block) {
      this._block.hide();
    }
  }

  public match(pathname: string): boolean {
    return pathname === this._pathname;
  }

  public render(): void {
    if (!this._block) {
      this._block = new this._blockClass();
    }

    this._block.show();

    render(this._props.rootQuery, this._block);
  }
}
