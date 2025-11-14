import pino from "pino";

// Configure for development (human-readable) or production (JSON)
const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "SYS:h:MM:ss TT",
      ignore: "pid,hostname",
    },
  },
});

export default logger;
