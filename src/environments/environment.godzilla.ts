import { Environment } from './common';
export const environment = {
  production: true,
  api: {
    protocol: 'https',
    hostname: 'storage.googleapis.com',
    port: 4443,
    ignorePort: true,
  },
  projectId: 'autr-godzilla',
} as Environment;
