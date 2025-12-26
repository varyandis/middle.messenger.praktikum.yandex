import { expect } from "chai";
import sinon from "sinon";
import { JSDOM } from "jsdom";
import { Block, type Props } from "./Block";

type TestTools = {
  getRenderCount: () => number;
};

const createTestBlockClass = (): {
  BlockClass: new (p?: Props) => Block<Props>;
  tools: TestTools;
} => {
  let renderCount = 0;

  class TestBlock extends Block<Props> {
    constructor(props: Props = {}) {
      super("div", props);
    }

    protected render(): string {
      renderCount += 1;
      const text = String(this.props.text ?? "");
      return `<span>${text}</span>`;
    }
  }

  return {
    BlockClass: TestBlock,
    tools: {
      getRenderCount: () => renderCount,
    },
  };
};

describe("Block", () => {
  let dom: JSDOM;

  beforeEach(() => {
    dom = new JSDOM(`<!doctype html><html><body></body></html>`, {
      url: "http://localhost/",
    });

    (globalThis as unknown as { window: Window }).window =
      dom.window as unknown as Window;
    (globalThis as unknown as { document: Document }).document =
      dom.window.document;
  });

  afterEach(() => {
    sinon.restore();
    dom.window.close();
  });

  it("должен создать element и отрендерить строку в innerHTML при инициализации", () => {
    const { BlockClass, tools } = createTestBlockClass();

    const block = new BlockClass({ text: "hello" });

    expect(block.element).to.not.equal(null);
    expect(block.element?.tagName.toLowerCase()).to.equal("div");
    expect(block.element?.innerHTML).to.equal("<span>hello</span>");
    expect(tools.getRenderCount()).to.equal(1);
  });

  it("setProps должен вызывать rerender, если componentDidUpdate вернул true", () => {
    let renderCount = 0;

    class UpdateBlock extends Block<Props> {
      constructor(props: Props = {}) {
        super("div", props);
      }

      protected render(): string {
        renderCount += 1;
        return `<span>${String(this.props.text ?? "")}</span>`;
      }

      protected componentDidUpdate(): boolean {
        return true;
      }
    }

    const block = new UpdateBlock({ text: "a" });
    expect(renderCount).to.equal(1);

    block.setProps({ text: "b" });

    expect(renderCount).to.equal(2);
    expect(block.element?.innerHTML).to.equal("<span>b</span>");
  });

  it("setProps НЕ должен вызывать rerender, если componentDidUpdate вернул false", () => {
    let renderCount = 0;

    class NoUpdateBlock extends Block<Props> {
      constructor(props: Props = {}) {
        super("div", props);
      }

      protected render(): string {
        renderCount += 1;
        return `<span>${String(this.props.text ?? "")}</span>`;
      }

      protected componentDidUpdate(): boolean {
        return false;
      }
    }

    const block = new NoUpdateBlock({ text: "a" });
    expect(renderCount).to.equal(1);

    block.setProps({ text: "b" });

    expect(renderCount).to.equal(1);
    expect(block.element?.innerHTML).to.equal("<span>a</span>");
  });

  it("show/hide должны менять display элемента", () => {
    const { BlockClass } = createTestBlockClass();
    const block = new BlockClass({ text: "x" });

    block.hide();
    expect(block.element?.style.display).to.equal("none");

    block.show();
    expect(block.element?.style.display).to.equal("block");
  });

  it("должен навешивать events на element и снимать их перед повторным render", () => {
    const { BlockClass } = createTestBlockClass();
    const clickHandler = sinon.spy();

    const HTMLElementCtor = window.HTMLElement;

    const addSpy = sinon.spy(HTMLElementCtor.prototype, "addEventListener");
    const removeSpy = sinon.spy(
      HTMLElementCtor.prototype,
      "removeEventListener"
    );

    try {
      const block = new BlockClass({
        text: "a",
        events: { click: clickHandler },
      });

      expect(addSpy.called).to.equal(true);

      block.setProps({ text: "b" });

      expect(removeSpy.called).to.equal(true);
      expect(addSpy.calledWith("click", clickHandler)).to.equal(true);
      expect(removeSpy.calledWith("click", clickHandler)).to.equal(true);
    } finally {
      addSpy.restore();
      removeSpy.restore();
    }
  });
});
