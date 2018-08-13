
export = WebworkerPromise;

declare class WebworkerPromise {
  constructor(worker: Worker);

  terminate(): void;
  isFree(): boolean;
  jobsLength(): number;
  exec(operationName: string, data: any, transferable?: any[], onEvent?: () => void): Promise<any>;
  postMessage(data: any, transferable?: any[], onEvent?: () => void): Promise<any>;
  emit(eventName: string, ...args: any[]): void;
}
