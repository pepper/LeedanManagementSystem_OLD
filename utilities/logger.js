var winston = require("winston");

// Logger config section
var config = {
	levels: {
		silly: 0,
		verbose: 1,
		info: 2,
		data: 3,
		warn: 4,
		debug: 5,
		error: 6
	},
	colors: {
		silly: 'magenta',
		verbose: 'cyan',
		info: 'green',
		data: 'grey',
		warn: 'yellow',
		debug: 'blue',
		error: 'red'
	}
};

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.Console)({
			colorize: true,
			timestamp: true
		})
	],
	levels: config.levels,
	colors: config.colors
});

var logger_error_old = logger.error;
logger.error = function(message){
	var fileAndLine = traceCaller(1);
	return logger_error_old.call(this, fileAndLine + ":" + message);
}

function traceCaller(n) {
	if( isNaN(n) || n<0) n=1;
	n+=1;
	var s = (new Error()).stack
	  , a=s.indexOf('\n',5);
	while(n--) {
	  a=s.indexOf('\n',a+1);
	  if( a<0 ) { a=s.lastIndexOf('\n',s.length); break;}
	}
	b=s.indexOf('\n',a+1); if( b<0 ) b=s.length;
	a=Math.max(s.lastIndexOf(' ',b), s.lastIndexOf('/',b));
	b=s.lastIndexOf(':',b);
	s=s.substring(a+1,b);
	return s;
}

exports = module.exports = logger;