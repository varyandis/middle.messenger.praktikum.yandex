import { expect } from "chai";
import sinon from "sinon";
import { JSDOM } from "jsdom";
import { Route } from "./Route";
import { Block } from "./Block";

describe("Route", () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM(
      `<!doctype html><html><body><div id="app"></div></body></html>`,
      { url: "http://localhost/" }
    );

    (globalThis as unknown as { window: Window }).window =
      dom.window as unknown as Window;
    (globalThis as unknown as { document: Document }).document =
      dom.window.document;
  });

  afterEach(() => {
    sinon.restore();
    dom.window.close();
  });

  it("match(): должен возвращать true, если pathname совпадает", () => {
    class TestBlock extends Block {
      constructor() {
        super("div", {});
      }
      protected render(): string {
        return "<div>content</div>";
      }
    }

    const route = new Route("/test", TestBlock, { rootQuery: "#app" });

    expect(route.match("/test")).to.equal(true);
    expect(route.match("/other")).to.equal(false);
  });

  it("render(): должен создать block, вызвать show() и обратиться к корню по rootQuery", () => {
    let createdCount = 0;

    class TestBlock extends Block {
      constructor() {
        super("div", {});
        createdCount += 1;
      }
      protected render(): string {
        return "<div>content</div>";
      }
    }

    const showSpy = sinon.spy(TestBlock.prototype, "show");
    const qsSpy = sinon.spy(document, "querySelector");

    const route = new Route("/test", TestBlock, { rootQuery: "#app" });
    route.render();

    expect(createdCount).to.equal(1);
    expect(showSpy.calledOnce).to.equal(true);
    expect(qsSpy.calledWith("#app")).to.equal(true);
  });

  it("render(): не должен создавать block повторно при повторном вызове", () => {
    let createdCount = 0;

    class TestBlock extends Block {
      constructor() {
        super("div", {});
        createdCount += 1;
      }
      protected render(): string {
        return "<div>content</div>";
      }
    }

    const route = new Route("/test", TestBlock, { rootQuery: "#app" });

    route.render();
    route.render();

    expect(createdCount).to.equal(1);
  });

  it("leave(): должен вызвать hide() и dispatchComponentDidHide()", () => {
    class TestBlock extends Block {
      constructor() {
        super("div", {});
      }
      protected render(): string {
        return "<div>content</div>";
      }
    }

    const hideSpy = sinon.spy(TestBlock.prototype, "hide");
    const didHideSpy = sinon.spy(
      TestBlock.prototype,
      "dispatchComponentDidHide"
    );

    const route = new Route("/test", TestBlock, { rootQuery: "#app" });

    route.render();
    route.leave();

    expect(hideSpy.calledOnce).to.equal(true);
    expect(didHideSpy.calledOnce).to.equal(true);
  });

  it("navigate(): должен вызвать render при совпадении pathname", () => {
    class TestBlock extends Block {
      constructor() {
        super("div", {});
      }
      protected render(): string {
        return "<div>content</div>";
      }
    }

    const renderSpy = sinon.spy(Route.prototype, "render");

    const route = new Route("/test", TestBlock, { rootQuery: "#app" });
    route.navigate("/test");

    expect(renderSpy.calledOnce).to.equal(true);
  });
});
