import { expect } from "chai";
import sinon from "sinon";
import { EventBus } from "./EventBus";

describe("EventBus", () => {
  it("on + emit: должен вызывать подписанный обработчик с аргументами", () => {
    const bus = new EventBus();
    const handler = sinon.spy();

    bus.on("test", handler);
    bus.emit("test", 1, "a");

    expect(handler.calledOnce).to.equal(true);
    expect(handler.calledWith(1, "a")).to.equal(true);
  });

  it("emit: должен вызывать всех подписчиков события", () => {
    const bus = new EventBus();
    const h1 = sinon.spy();
    const h2 = sinon.spy();

    bus.on("test", h1);
    bus.on("test", h2);

    bus.emit("test");

    expect(h1.calledOnce).to.equal(true);
    expect(h2.calledOnce).to.equal(true);
  });

  it("off: должен отписывать обработчик (после off он не вызывается)", () => {
    const bus = new EventBus();
    const handler = sinon.spy();

    bus.on("test", handler);
    bus.off("test", handler);

    bus.emit("test");

    expect(handler.called).to.equal(false);
  });

  it("off: должен выбрасывать ошибку, если события не существует", () => {
    const bus = new EventBus();
    const handler = sinon.spy();

    expect(() => bus.off("unknown", handler)).to.throw("Нет события: unknown");
  });
});
