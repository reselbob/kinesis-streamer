# kinesis-streamer
A project the demonstrates an application that sends messages with random data continuously to a predefined AWS Kinesis Stream.

The way the application works is that it creates a number of CronJobs, with each CronJob running every second. The CronJob's logic sends one or many messages to a Kinesis Stream. This Kinesis Stream must be running under AWS before the application starts.

The credentials required to access to the Kinesis Stream are defined in a file named `config.json`. The file named `config.json` needs to be created and configured. (A section that follows describes the details of creating and configuring the file `config.json`.)

The name of a particular Kinesis Stream to bind to is defined by an environment variable that is stored in a file named `.env`. The file `.env` also needs to be created and configured. (A section that follows describes the details of creating and configuring the file `.env`.) Also, overriding the default number of CronJobs that will run simultaneously and the number of messages that will be sent by each CronJobs are defined in the `.env` file. 

## Installation

`npm install`

## Testing

`npm test`

## Running the project

This project depends on the existence of an accessible Kinesis Stream running on AWS.

## Creating the `config.json` file

Once you get Kinesis Stream up and running, you need to create and configure the file `./config.json` within this project in order to provide AWS credentials and region to the application.

The structure of the file `./config.json` is as follows:

```json
{
  "accessKeyId": ",<YOUR_ACCESS_KEY_ID>",
  "secretAccessKey": "<YOUR_SECRET_ACCESS_KEY>",
  "region": "<REGION_ID>" // for example, us-east-1
}
```

You can read the details of configuring the `config.json` on the AWS site [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-json-file.html)

## Configuring the environment variables

This project uses the [`dotenv`](https://www.npmjs.com/package/dotenv) NPM package to inject environment variables into the application at runtime.

This project looks in the root directory for a file named `.env`. This project does **not** ship with the `.env` file. You need to create it in the root of this project.

The environment variables are defined in the `.env` file like so:

```text
AWS_KINESIS_STREAM_NAME=my-stream-kinesis
CRON_JOBS_TO_GENERATE=50
MESSAGES_PER_CRON_JOB=20
```

The following sections describe the particulars of each environment variable 

----

**`AWS_KINESIS_STREAM_NAME`**

REQUIRED

This project reads the name for the Kinesis stream from environment variable. Thus, you need to set the environment variable as follows:

`AWS_KINESIS_STREAM_NAME=<stream_name>`

**Example:**

`AWS_KINESIS_STREAM_NAME=my-stream-kinesis`

----

**`CRON_JOBS_TO_GENERATE`**

OPTIONAL

Defines to the number of CronJobs to generate and run against the AWS Kinesis stream. If you do not provide this environment variable, the default number of CronJobs generated is 10.

**Example:**

`CRON_JOBS_TO_GENERATE=50`

----

**`MESSAGES_PER_CRON_JOB`**

OPTIONAL

Defines to the number of messages to generate to send to the AWS Kinesis Stream in a single submission. If you do not provide this environment variable, the default number of CronJobs generated is 10.

**Example:**

`MESSAGES_PER_CRON_JOB=20`

----

## Starting the application

To start the application, execute the following command:

`npm start`