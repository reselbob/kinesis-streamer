const CronJob = require('cron').CronJob;
const AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});
AWS.config.setPromisesDependency(Promise)
const kinesis = new AWS.Kinesis();
const {v4: uuidv4} = require('uuid');
const {logger} = require('./logger');

//Load the access credentials and region from
//config file
AWS.config.loadFromPath('./config.json');

/**
 * Creates a structured message with random data
 * @param index, an index number to assign to each message
 * @returns {{date: Date, index, message: (*|string)}}
 */
const getMessageSync = (index) => {
    const message = uuidv4();
    const date = new Date();
    return {index, message, date};
}
/***
 * Creates CronJob for submitting messages to a Kinesis Stream
 * @param streamName {string} The name of the stream to where messages will
 * be sent REQUIRED
 * @param numberOfMessages {number} the number of message to send to the stream in
 * one submission. Defaults to 1
 * @param shardID {string} The shard ID as defined by AWS Kinesis, defaults to
 * shardId-000000000000
 * @returns {Promise<*>} The CronJob
 */
const createCronJob = async (streamName, numberOfMessages, shardID) => {
    if(! streamName) new Error('no streamName defined!');
    const myShardID = shardID || 'shardId-000000000000'
    const period = '* * * * * *';
    const job = new CronJob(period, async function () {
        const records = [];
        const max = numberOfMessages || 1;
        for (let i = 0; i < max; i++) {
            const msg = {
                Data: Buffer.from(JSON.stringify(getMessageSync())),
                PartitionKey: myShardID /* required */
            };
            records.push(msg);
            logger.info(`Added ${numberOfMessages} messages at ${new Date()}`)
        }

        const params = {
            Records: records,
            StreamName: streamName /* required */
        };
        await kinesis.putRecords(params).promise()
            .then(data => {
                logger.info(JSON.stringify(data));
            })
            .catch(err => {
                logger.error(err, err.stack);
            })

    }, null, true, 'America/Los_Angeles');
    job.start();
    logger.info(`Is job running?: ${job.running}`);
    return job;
}
/**
 * Creates CronJobs that send messages to a the stream
 * @param streamName {string} The name of the stream to where messages will
 * be sent REQUIRED
 * @param numberOfCronJobs {number} the number of CronJobs to generate, default is 1
 * @param numberOfMessages {number} the number of messages to send in each CronJob submission
 * @param shardID {string} the ShardID as defined by the AWS Kinesis Stream
 * @returns {Promise<*[]>} the CronJobs generated and running
 */
const stream = async (streamName, numberOfCronJobs, numberOfMessages, shardID) => {
    logger.info(`Starting stream at ${new Date()}`);
    const jobCount = numberOfCronJobs || 1;
    const messageCount = numberOfMessages || 1;
    const cronJobs = [];
    for (let i = 0; i < jobCount; i++) {
        const cronJob = await createCronJob(streamName, messageCount, shardID);
        cronJobs.push(cronJob);
    }
    return cronJobs;
}
/**
 *
 * @param cronJobs {array} The CronJobs to stop
 * @returns {Promise<object>} An object that describes the status of the
 * method, stopJobs
 */
const stopJobs = async (cronJobs) => {
    for (const job of cronJobs){
        await job.stop()
            .catch(error => {
                return {status: 'ERROR', error}
            })
    }
    return {status: 'OK'}
}

module.exports ={stream, stopJobs}