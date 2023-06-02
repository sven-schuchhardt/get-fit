// https://blog.appsignal.com/2021/09/01/best-practices-for-logging-in-nodejs.html

import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [new transports.Console({
    silent: process.env.environment === "test"
  })],
});
