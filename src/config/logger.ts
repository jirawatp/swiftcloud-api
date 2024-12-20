import { WinstonModuleOptions } from 'nest-winston';
import { transports, format } from 'winston';

export function getWinstonConfig(): WinstonModuleOptions {
  return {
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.colorize({ all: true }),
          format.printf(({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`)
        )
      })
    ]
  };
}