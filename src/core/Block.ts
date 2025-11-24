import { EventBus, type EventBusCallback } from './EventBus';

export type Props = Record<string, unknown>;

export class Block<P extends Props = Props> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_RENDER: 'flow:render',
    FLOW_CDU: 'flow:component-did-update',
  } as const;

  protected _element: HTMLElement | null = null;
  private _meta: { tagName: string; props: P };

  public props: P;
  private _eventBus: EventBus;

  constructor(tagName: string = 'div', props: P = {} as P) {
    const eventBus = new EventBus();

    this._meta = {
      tagName,
      props,
    };

    this.props = this._makePropsProxy(props);
    this._eventBus = eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private _registerEvents(eventBus: EventBus) {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));

    eventBus.on(
      Block.EVENTS.FLOW_CDU,
      this._componentDidUpdate.bind(this) as EventBusCallback,
    );
  }

  private _createResources() {
    const { tagName } = this._meta;
    this._element = this._createDocumentElement(tagName);
  }

  protected init(): void {
    this._createResources();
    this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();
  }

  protected componentDidMount(): void {}

  public dispatchComponentDidMount(): void {
    this._eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: P, newProps: P): void {
    const shouldUpdate = this.componentDidUpdate(oldProps, newProps);

    if (shouldUpdate) {
      this._eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  protected componentDidUpdate(_oldProps: P, _newProps: P): boolean {
    return true;
  }

  public setProps(nextProps: Partial<P>): void {
    if (!nextProps) return;

    Object.assign(this.props as object, nextProps);
  }

  public get element(): HTMLElement | null {
    return this._element;
  }

  private _render(): void {
    const block = this.render();

    if (this._element) {
      this._element.innerHTML = block;
    }
  }

  protected render(): string {
    return '';
  }

  public getContent(): HTMLElement | null {
    return this.element;
  }

  private _makePropsProxy(props: P): P {
    return new Proxy(props, {
      set: (target, prop: string, value) => {
        const oldProps = { ...(target as Props) } as P;

        (target as Props)[prop] = value;

        this._eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);

        return true;
      },

      deleteProperty() {
        throw new Error('нет доступа');
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLElement {
    return document.createElement(tagName);
  }

  public show(): void {
    if (this._element) {
      this._element.style.display = 'block';
    }
  }

  public hide(): void {
    if (this._element) {
      this._element.style.display = 'none';
    }
  }
}
