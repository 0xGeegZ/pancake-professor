const winston = require('winston')

const logFormat = winston.format.printf(
  (info) => `${new Date().toLocaleString('fr-FR')} - ${info.level} : ${JSON.stringify(info.message, null, 4)}`
)

const format = winston.format.combine(
  winston.format.colorize(),
  winston.format.json(),
  winston.format.simple(),
  logFormat
)
const logger = winston.createLogger({
  level: 'info',
  // format: winston.format.json(),
  format,
  // defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
})

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format,
    })
  )
}

module.exports = logger
