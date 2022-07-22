const { Endpoint } = require('aws-sdk');
const AWS = require('aws-sdk'); //npm install aws-sdk
AWS.config.update({
    region: 'eu-west-2'
})
require('dotenv').config();  //required for AWS credentials which are named creds and are loaded from .env
jest.setTimeout(10000)


describe('AWS S3 connection', () => {
    test('it makes connection to AWS services and returns buckets as an object of arrays', async() => {
        const s3 = new AWS.S3()
        const response = s3.listBuckets();
        const buckets = await response.promise();
        expect(buckets).toBeInstanceOf(Object);
        expect(buckets).toHaveProperty('Buckets'); 
    });
})