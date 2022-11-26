var winston = require('winston');

module.exports = new winston.Logger({
	transports:[
	new winston.transports.File({
		name: 'info-internet-banking',
		level: "info",
		filename: "./app/logs/info-internet-banking",
		maxsize: 1048576,
		maxFiles: 10,
		colorize: false
	}),
	new winston.transports.File({
		name: 'errors-internet-banking',
		level: "error",
		filename: "./app/logs/errors-internet-banking",
		maxsize: 1048576,
		maxFiles: 10,
		colorize: false
	})
	]
});