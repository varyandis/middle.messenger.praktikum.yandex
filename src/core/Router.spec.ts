import { expect } from "chai";
import sinon from "sinon";
import { JSDOM } from "jsdom";
import { Router } from "./Router";
import { Route } from "./Route";
import type { Block } from "./Block";

/**
 * Router.use ожидает конструктор Block,
 * но в тестах мы стабим render/leave и не создаём реальный блок.
 * Поэтому безопасно приводим через unknown.
 */
type BlockCtor = new () => Block;
const asBlockCtor = (ctor: unknown): BlockCtor => ctor as BlockCtor;

class DummyBlock {}

describe("Router", () => {
  let dom: JSDOM;

  beforeEach(() => {
    // Сбрасываем singleton Router между тестами (без any)
    const RouterClass = Router as unknown as { __instance: Router | null };
    RouterClass.__instance = null;

    // Поднимаем jsdom
    dom = new JSDOM(
      `<!doctype html><html><body><div id="app"></div></body></html>`,
      { url: "http://localhost/" }
    );

    // jsdom ≠ настоящий браузерный Window → приводим через unknown
    (globalThis as unknown as { window: Window }).window =
      dom.window as unknown as Window;

    (globalThis as unknown as { document: Document }).document =
      dom.window.document;

    (globalThis as unknown as { history: History }).history = dom.window
      .history as unknown as History;

    (globalThis as unknown as { location: Location }).location = dom.window
      .location as unknown as Location;
  });

  afterEach(() => {
    sinon.restore();
    dom.window.close();
  });

  it("go() должен менять pathname и вызывать render у нужного роута", () => {
    const renderStub = sinon.stub(Route.prototype, "render").returns();
    const leaveStub = sinon.stub(Route.prototype, "leave").returns();

    const router = new Router("#app");
    router.use("/login", asBlockCtor(DummyBlock));
    router.use("/404", asBlockCtor(DummyBlock));

    router.go("/login");

    expect(window.location.pathname).to.equal("/login");
    expect(renderStub.calledOnce).to.equal(true);
    expect(leaveStub.called).to.equal(false);
  });

  it("при переходе на другой роут должен вызывать leave у предыдущего роута", () => {
    const renderStub = sinon.stub(Route.prototype, "render").returns();
    const leaveStub = sinon.stub(Route.prototype, "leave").returns();

    const router = new Router("#app");
    router.use("/a", asBlockCtor(DummyBlock));
    router.use("/b", asBlockCtor(DummyBlock));
    router.use("/404", asBlockCtor(DummyBlock));

    router.go("/a");
    router.go("/b");

    expect(window.location.pathname).to.equal("/b");
    expect(renderStub.callCount).to.equal(2);
    expect(leaveStub.callCount).to.equal(1);
  });
});
