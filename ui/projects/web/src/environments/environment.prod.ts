import { getAppVersion } from './version';

export const environment = {
  production: true,
  apiUrl: process.env.NG_APP_API_URL,
  version: getAppVersion('prod'),
};
