export abstract class BaseAPI {
  public create(_data?: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }

  public request(_data?: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }

  public update(_data?: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }

  public delete(_data?: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }
}
