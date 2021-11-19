require('dotenv').config();
const {stream, stopJobs} = require('./streamer');
const {logger} = require('./logger');
logger.info(`Starting streamer at ${new Date()}`);

const getEnvVarErrorMessage = (env_var) => {
    return `The environment value ${env_var} has not been set`;
}
// Check to make sure that all the required environment variables are present
if(! process.env.AWS_KINESIS_STREAM_NAME) throw new Error(getEnvVarErrorMessage('AWS_KINESIS_STREAM_NAME'))
if(! process.env.AWS_ACCESS_KEY_ID) throw new Error(getEnvVarErrorMessage('AWS_ACCESS_KEY_ID'))
if(! process.env.AWS_SECRET_ACCESS_KEY) throw new Error(getEnvVarErrorMessage('AWS_SECRET_ACCESS_KEY'))

// Do the local variable assigments
const streamName = process.env.AWS_KINESIS_STREAM_NAME;
const numOfJobs = process.env.CRON_JOBS_TO_GENERATE || 10;
const numOfMessage = process.env.MESSAGES_PER_CRON_JOB || 10;

// Fire up the streamer which will send message
// to the Kinesis stream defined by AWS_KINESIS_STREAM_NAME
stream(streamName,numOfJobs,numOfMessage)
    .then(data =>{
        logger.info(data);
    });
