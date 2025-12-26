import { expect } from "chai";
import { JSDOM } from "jsdom";
import { render } from "./render";

describe("render (Handlebars)", () => {
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
    dom.window.close();
  });

  it("должен отрендерить HTML в элемент по селектору", () => {
    const template = `<p>Hello</p>`;

    render("#app", template);

    const root = document.querySelector("#app");
    expect(root?.innerHTML).to.equal("<p>Hello</p>");
  });

  it("должен подставлять данные из context", () => {
    const template = `<p>Hello, {{name}}</p>`;

    render("#app", template, { name: "Sasha" });

    const root = document.querySelector("#app");
    expect(root?.innerHTML).to.equal("<p>Hello, Sasha</p>");
  });

  it("не должен падать, если элемент по селектору не найден", () => {
    const template = `<p>Test</p>`;

    expect(() => {
      render("#unknown", template);
    }).to.not.throw();
  });
});
