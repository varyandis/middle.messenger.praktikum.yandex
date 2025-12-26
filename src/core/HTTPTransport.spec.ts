import { expect } from "chai";
import sinon from "sinon";
import { HTTPTransport } from "./HTTPTransport";

describe("HTTPTransport", () => {
  let xhrMock: XMLHttpRequest;

  beforeEach(() => {
    xhrMock = {
      open: sinon.spy(),
      send: sinon.spy(),
      setRequestHeader: sinon.spy(),
      withCredentials: false,
      timeout: 0,
      onload: null,
      onerror: null,
      onabort: null,
      ontimeout: null,
    } as unknown as XMLHttpRequest;

    // В Node.js нет XMLHttpRequest — объявляем вручную
    (globalThis as unknown as { XMLHttpRequest: unknown }).XMLHttpRequest =
      sinon.stub().returns(xhrMock);
  });

  afterEach(() => {
    sinon.restore();
    delete (globalThis as unknown as { XMLHttpRequest?: unknown })
      .XMLHttpRequest;
  });

  const fireLoad = () => {
    // Аргумент ev обязателен по типам, но в коде не используется.
    const ev = {} as unknown as ProgressEvent<EventTarget>;
    xhrMock.onload?.(ev);
  };

  it("GET: должен корректно формировать URL с query-параметрами", async () => {
    const transport = new HTTPTransport("https://example.com");

    const promise = transport.get("/test", {
      data: { a: 1, b: "hello" },
    });

    fireLoad();
    await promise;

    const openSpy = xhrMock.open as sinon.SinonSpy;
    expect(openSpy.calledOnce).to.equal(true);

    const [, url] = openSpy.firstCall.args;
    expect(url).to.equal("https://example.com/test?a=1&b=hello");
  });

  it("POST: должен отправлять JSON и выставлять Content-Type", async () => {
    const transport = new HTTPTransport("https://api.test");
    const data = { name: "Sasha" };

    const promise = transport.post("/user", { data });

    fireLoad();
    await promise;

    const setHeaderSpy = xhrMock.setRequestHeader as sinon.SinonSpy;
    const sendSpy = xhrMock.send as sinon.SinonSpy;

    expect(
      setHeaderSpy.calledWith("Content-Type", "application/json")
    ).to.equal(true);
    expect(sendSpy.calledWith(JSON.stringify(data))).to.equal(true);
  });

  it("должен включать withCredentials и устанавливать timeout", async () => {
    const transport = new HTTPTransport("https://example.com");

    const promise = transport.get("/secure", { timeout: 3000 });

    fireLoad();
    await promise;

    expect(xhrMock.withCredentials).to.equal(true);
    expect(xhrMock.timeout).to.equal(3000);
  });
});
