type WSMessage = unknown;

export class WSTransport {
  private socket: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(this.url);

      this.socket.addEventListener("open", () => resolve());
      this.socket.addEventListener("error", () =>
        reject(new Error("WebSocket error"))
      );
    });
  }

  public send(data: unknown): void {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) return;
    this.socket.send(JSON.stringify(data));
  }

  public onMessage(cb: (data: WSMessage) => void): void {
    this.socket?.addEventListener("message", (event) => {
      try {
        cb(JSON.parse(event.data));
      } catch {
        cb(event.data);
      }
    });
  }

  public close(): void {
    this.socket?.close();
    this.socket = null;
  }
}
