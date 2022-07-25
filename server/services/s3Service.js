const AWS = require('aws-sdk'); //npm install aws-sdk
AWS.config.update({
    region: 'eu-west-2'
})
require('dotenv').config();  //required for AWS credentials which are named creds and are loaded from .env
const createError = require('http-errors');
var AdmZip = require("adm-zip");
const PassThrough = require('stream').PassThrough;
const archiver = require('archiver');

module.exports = {
    // Upload image
    uploadImage: async(image) => {
        const s3 = new AWS.S3();
        const fileContent = Buffer.from(image.data, 'binary');
        const params = {
            Bucket: 'record-store-czr/images',
            Key: image.name,
            Body: fileContent
        };
        
        try {
            const upload = s3.upload(params);
            const data = await upload.promise()
            return data;
        } catch (err) {
            throw err;
        }
    },
    // Upload track/s
    uploadTracks: async(tracks) => {
        const s3 = new AWS.S3();
        let response = []
        if (tracks.hasOwnProperty('length')) {              //if multiple files are selected
            tracks.forEach(item => {
                const fileContent = Buffer.from(item.data, 'binary');
                const params = {
                    Bucket: 'record-store-czr/tracks',
                    Key: item.name,
                    Body: fileContent
                };
                
                s3.upload(params, (err,data) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    response.push(data);
                });
            });
            return response;
        } else if (!tracks.hasOwnProperty('length')) {      //if single file is selected
            const s3 = new AWS.S3();
            const fileContent = Buffer.from(tracks.data, 'binary');
            const params = {
                Bucket: 'record-store-czr/tracks',
                Key: tracks.name,
                Body: fileContent
            };
        
            try {
                const upload = s3.upload(params);
                const data = await upload.promise()
                return data;
            } catch (err) {
                throw err;
            }

        } else {
            return createError(404, 'No file selected')   //if no file was selected
        };

    },
    // Upload sample/s
    uploadSamples: async(samples) => {
        const s3 = new AWS.S3();
        let response = []
        if (samples.hasOwnProperty('length')) {             //implementation for multiple audi files
            samples.forEach(item => {
                const fileContent = Buffer.from(item.data, 'binary');
    
                const params = {
                    Bucket: 'record-store-czr/samples',
                    Key: item.name,
                    Body: fileContent
                };
                
                s3.upload(params, (err,data) => {
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    response.push(data);
                });
            });
            return response;
        } else if (!samples.hasOwnProperty('length')) {   //implementation for single file
            const s3 = new AWS.S3();
            const fileContent = Buffer.from(samples.data, 'binary');
            const params = {
                Bucket: 'record-store-czr/samples',
                Key: samples.name,
                Body: fileContent
            };
        
            try {
                const upload = s3.upload(params);
                const data = await upload.promise()
                return data;
            } catch (err) {
                throw err;
            };
            
        } else {
            return createError(404, 'No file selected')  //if no file was selected
        };
    },
    // Delete image
    deleteImage: async(cover) => {
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'record-store-czr/images',
            Key: cover
        };
        try {
            const deleteResponse = s3.deleteObject(params);
            const data = await deleteResponse.promise();
            return data;
        } catch (err) {
            console.log(err.stack)
            throw err;
        };
    },
    // Delete track
    deleteTrack: async(title) => {
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'record-store-czr/tracks',
            Key: title
        };
        try {
            const deleteResponse = s3.deleteObject(params);
            const data = await deleteResponse.promise();
            return data;
        } catch (err) {
            console.log(err.stack)
            throw err;
        };
    },

    // Delete samples
    deleteSample: async(sample) => {
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'record-store-czr/samples',
            Key: sample
        };
        try {
            const deleteResponse = s3.deleteObject(params);
            const data = await deleteResponse.promise();
            return data;
        } catch (err) {
            console.log(err.stack)
            throw err;
        };
    },

    downloadTrack: async(title) => {
        const s3 = new AWS.S3();
        const params = {
            Bucket: 'record-store-czr/tracks',
            Key: title
        };
        try {
            const data = await s3.getObject(params).promise();
            return data;

        } catch (err) {
            console.log(err.stack)
            throw err;
        }
    },

    
    downloadAlltracks: async(tracks) => {
        // using archiver package to create archive object with zip setting -> level from 0(fast, low compression) to 10(slow, high compression) 
        const zip = archiver('zip', { zlib: { level: 5 } });
        const s3 = new AWS.S3();
        tracks.forEach(async(track) => {
            const passThrough = new PassThrough();
            const params = {
                Bucket: 'record-store-czr/tracks',
                Key: track
            };
            s3
              .getObject(params)
              .createReadStream()
              .pipe(passThrough);
            zip.append(passThrough, { name: track });
        })
    
        return zip;
      }
}