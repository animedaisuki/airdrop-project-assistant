const winston = require("winston");

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    // 写入错误日志到文件
    new winston.transports.File({ filename: "error.log", level: "error" }),

    // 在控制台打印日志
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});

module.exports = logger;
