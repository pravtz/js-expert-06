import pino, { transport } from "pino";

const log = pino({
    enable: !(!!process.env.LOG_DISABLED),
    transport: {
        target: 'pino-pretty',
        options:{
            colorize: true
        }

    }
})

export const logger = log