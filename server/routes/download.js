const downloadRouter = require('express').Router()
const { S3 } = require('aws-sdk');
const ReleaseService = require('../services/releaseService');
const s3Service = require('../services/s3Service');
const S3ervice = require('../services/s3Service');

var AdmZip = require("adm-zip");

require('dotenv').config();

// Single track download
//Frontend for downloading: https://stackoverflow.com/questions/22143628/nodejs-how-do-i-download-a-file-to-disk-from-an-aws-s3-bucket
downloadRouter.get('/:id', async(req,res,next) => {
    try {
        const track = await ReleaseService.getSingleTrack(req.params.id);
        const file = await S3ervice.downloadTrack(track.title);
        res.status(200).send(file.Body);
    } catch (error) {
        next(error);
    }
})  


// Multiple file download (download album)
// Front end for downloading zip: https://stackoverflow.com/questions/33260789/create-and-send-zip-file-node-js

/* SOLUTION 1 - Buffer */
downloadRouter.get('/all/tracks', async(req,res,next) => {
    const zip = new AdmZip();
    try {
        await Promise.all(req.query.track.map(async(track) => {
            const dlResponse =  await S3ervice.downloadTrack(track);
            zip.addFile(track, Buffer.from(dlResponse.Body));
        }))  
        const data = zip.toBuffer()
        res.status(200).send(data)

    } catch (error) {
        next();
    }
});

/* SOLUTION 2 - stream https://dev.to/ldsrogan/aws-sdk-with-javascript-multi-files-download-from-s3-5118 */
// downloadRouter.get('/all/tracks', async(req,res,next) => {
//     try {
//         const stream = await s3Service.downloadAlltracks(req.query.track)
//         stream.pipe(res)
//         stream.finalize()
//     } catch (error) {
//         next();
//     }
    
// })

module.exports = downloadRouter;