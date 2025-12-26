import type { Block } from "./Block";
import { Route } from "./Route";

type BlockClass = new () => Block;

export class Router {
  private static __instance: Router | null = null;

  private routes: Route[] = [];
  private history!: History;
  private _currentRoute: Route | null = null;
  private _rootQuery!: string;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.history = window.history;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  public use(pathname: string, block: BlockClass): this {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);

    return this;
  }

  public start(): void {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname);
    };

    this._onRoute(window.location.pathname);
  }

  private _onRoute(pathname: string): void {
    let route = this.getRoute(pathname);

    if (!route) {
      route = this.getRoute("/404");
      if (!route) {
        console.warn(`Route not found for pathname: ${pathname}`);
        return;
      }
    }

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  public go(pathname: string): void {
    this.history.pushState({}, "", pathname);
    this._onRoute(pathname);
  }

  public back(): void {
    this.history.back();
  }

  public forward(): void {
    this.history.forward();
  }

  private getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname));
  }
}
