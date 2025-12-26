import { EventBus, type EventBusCallback } from "./EventBus";

type State = Record<string, unknown>;
type UpdatedListener = (state: State) => void;

export class Store {
  private state: State = {};
  private eventBus = new EventBus();

  private updatedListeners = new Map<UpdatedListener, EventBusCallback>();

  public onUpdated(callback: UpdatedListener): void {
    const wrapped: EventBusCallback = (...args) => {
      const state = args[0] as State;
      callback(state);
    };

    this.updatedListeners.set(callback, wrapped);
    this.eventBus.on("updated", wrapped);
  }

  public offUpdated(callback: UpdatedListener): void {
    const wrapped = this.updatedListeners.get(callback);
    if (!wrapped) return;

    this.eventBus.off("updated", wrapped);
    this.updatedListeners.delete(callback);
  }

  public getState(): State {
    return this.state;
  }

  public set(key: string, value: unknown): void {
    this.state = { ...this.state, [key]: value };
    this.eventBus.emit("updated", this.state);
  }
}
