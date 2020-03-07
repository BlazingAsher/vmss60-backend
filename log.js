var logger = require('winston');
const {LoggingWinston} = require('@google-cloud/logging-winston');

const loggingWinston = new LoggingWinston({
    projectId: 'vmss60',
    keyFilename: './key.json',
    logName: 'vmss60-backend-' + (process.env.NODE_ENV || 'unset')
});

if(process.env.NODE_ENV === 'development'){
    logger.add(new logger.transports.Console());
}

logger.add(loggingWinston);
module.exports=logger;