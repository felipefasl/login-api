import { LoggerInterceptor } from './../interceptors/logger.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig: WinstonModuleOptions = {

    levels: winston.config.npm.levels,
    level: 'verbose',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(context => {

                    const msgstr = JSON.stringify(context.message, null, '\t')
                    return `[${new Date()}][${context.level}]${msgstr}`
                }),
            ),
        }),
        new winston.transports.File({
            level: 'verbose',
            filename: 'application.log',
            dirname: 'logs',
        }),
    ],
};


export const loggerInterceptor = {
    
    provide: APP_INTERCEPTOR,
    useClass: LoggerInterceptor,
};