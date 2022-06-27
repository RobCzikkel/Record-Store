const AWS = require('aws-sdk'); //npm install aws-sdk
AWS.config.update({
    region: 'eu-west-2'
})
require('dotenv').config();  //required for AWS credentials which are named creds and are loaded from .env

describe('AWS S3 connection', () => {
    test('it makes connection to AWS services', async() => {
        const s3 = new AWS.S3();
    })
})