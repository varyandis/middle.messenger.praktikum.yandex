export type EventBusCallback = (...args: unknown[]) => void;

export class EventBus {
  private listeners: Record<string, EventBusCallback[]> = {};

  public on(event: string, callback: EventBusCallback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  public off(event: string, callback: EventBusCallback): void {
    if (!this.listeners[event]) {
      throw new Error(`Нет события: ${event}`);
    }

    this.listeners[event] = this.listeners[event].filter(
      (listener) => listener !== callback
    );
  }

  public emit(event: string, ...args: unknown[]): void {
    const listeners = this.listeners[event];

    if (!listeners || listeners.length === 0) {
      return;
    }

    listeners.forEach((listener) => {
      listener(...args);
    });
  }
}
