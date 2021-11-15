'use strict';
require('dotenv').config();
const chai = require('chai');
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;
const {v4: uuidv4} = require('uuid');
const {stream, stopJobs} = require('../streamer');
const AWS = require("aws-sdk");
const kinesis = new AWS.Kinesis();
const {logger} = require('../logger');

describe('Streamer Tests: ', async () => {

    it('Can get credentials', async function () {

        AWS.config.getCredentials(function(err) {
            if (err){
                logger.error(err.stack);
                throw new Error(err.stack);
            }
            else {
                expect(AWS.config.credentials.accessKeyId).to.be.a('string')
                logger.info(`Access key: ${AWS.config.credentials.accessKeyId}`);
                logger.info(`Access key: ${AWS.config.credentials.secretAccessKey}`);
                expect(AWS.config.region).to.be.a('string')
                logger.info(`Region: ${AWS.config.region}`);
            }
        });
    });

    it('Can get shardID', async function () {
        AWS.config.loadFromPath('./config.json');
        let params = {
            StreamName: 'my-stream-kinesis'
        };
        const result = await kinesis.listShards(params).promise()
            .then(data => {
                expect(data.Shards[0].ShardId).to.be.an('string');
                logger.info(JSON.stringify(data));
            })
    });
});