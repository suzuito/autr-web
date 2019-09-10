export interface Environment {
  production: boolean;
  api: URL;
  projectId: string;
}

export interface URL {
  protocol: string;
  hostname: string;
  port: number;
  ignorePort: boolean;
}
