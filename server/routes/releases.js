const releasesRouter = require('express').Router();
const { AuthFromCookie } = require('../services/jwtService');
const ReleaseService = require('../services/releaseService');
const S3ervice = require('../services/s3Service');

require('dotenv').config();
const fileUpload = require('express-fileupload');

// fileRouter.use(AuthFromCookie);
releasesRouter.use(fileUpload())

/************************************************************************************
ALBUM ENDPOINTS
************************************************************************************/
//GET ALL ALBUMS
releasesRouter.get('/', async(req,res,next) => {
    try {
        const response = await ReleaseService.getAlbums();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

//GET SINGLE ALBUM
releasesRouter.get('/:id', async(req,res,next) => {
    try {
        const response = await ReleaseService.getSingleAlbum(req.params.id);
        res.status(200).json(response);
    } catch (error) {
        throw error;
    }
});

//POST AN ALBUM
releasesRouter.post('/create-release', async(req,res,next) => {
    let params = req.body;
    try {
        if (!req.files) {               //if no cover was uploaded
            const response = await ReleaseService.createAlbum(params);
            res.status(201).json(response);
        }
        const s3response = await S3ervice.uploadImage(req.files.cover);   //if cover was uploaded
        params = {...params, cover: req.files.cover.name};
        const response = await ReleaseService.createAlbum(params);
        res.status(201).json({response});
    } catch (error) {
        next(error);
    }
});

//UPDATE/UPLOAD AN IMAGE FOR AN ALBUM 
releasesRouter.post('/:id/upload-image', async(req,res,next) => {
    try {
        if (!req.files) {
            res.status(404).json({"Error": "No file selected"});
        }
        const album = await ReleaseService.getSingleAlbum(req.params.id)
        const deleteResponse = await S3ervice.deleteImage(album.cover);  //this will delete the previous image first
        const s3response = await S3ervice.uploadImage(req.files.cover);  //this uploads the new image
        const response = await ReleaseService.updateAlbum({id: req.params.id, cover: req.files.cover.name});  //updates the cover in db
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
})

//UPDATE AN ALBUM
releasesRouter.put('/:id', async(req,res,next) => {
    try {
        const response = await ReleaseService.updateAlbum(req.body);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
});
//DELETE AN ALBUM
releasesRouter.delete('/:id', async(req,res,next) => {
    try {
        const album = await ReleaseService.getSingleAlbum(req.params.id);
        await S3ervice.deleteImage(album.cover);
        if(album.tracks.length > 0) {
            await Promise.all(album.tracks.map(async(track) => await S3ervice.deleteTrack(track)));
        }
        const response = await ReleaseService.deleteAlbum(req.params.id);
        res.status(200).json({"Album deleted": response});
    } catch (error) {
        next(error);
    }
    
});

/****************************************************************************************************************
TRACKS ENDPOINTS
****************************************************************************************************************/
//ADD TRACK + SAMPLE VIA RELEASE
releasesRouter.post('/:id/upload-track', async(req,res,next) => {
    let params = req.body
    let sampleResponse = null;
    let trackResponse = null;
    try {
        trackResponse = await S3ervice.uploadTracks(req.files.track);
        params = {...params, title: req.files.track.name}
        if (req.files.sample) {
            sampleResponse = await S3ervice.uploadSamples(req.files.sample);
            params = {...params, sample: req.files.sample.name}
        };
        const dbResponse = await ReleaseService.addTrack(req.params.id,params);
        res.status(201).json({trackResponse,sampleResponse,dbResponse});

    } catch (error) {
        next(error)
    }
});
//UPDATE TRACKS DB & S3 - USE IT WITH REACT-EDIT-TEXT
releasesRouter.put('/:id/update-track', async(req,res,next) => {
    const track = await ReleaseService.getSingleTrack(req.params.id);
    let params = req.body;
    let trackDelResponse;
    let trackUpResponse;
    let sampleDelResponse;
    let sampleUpResponse;
    try {
        if (req.files.track) {
            trackDelResponse = await S3ervice.deleteTrack(track.title);
            trackUpResponse = await S3ervice.uploadTracks(req.files.track);
            params = {...params, title: req.files.track.name};
        };
        if (req.files.sample) {
            sampleDelResponse = await S3ervice.deleteSample(track.sample);
            sampleUpResponse = await S3ervice.uploadSamples(req.files.sample);
            params = {...params, sample: req.files.sample.name};
        };
        let dbResponse = await ReleaseService.updateTrack(req.params.id,params);
        res.status(200).json({dbResponse,trackUpResponse,sampleUpResponse});
    } catch (error) {
        next(error);
    }
});
//DELETE TRACK
releasesRouter.delete('/tracks/:id', async(req,res,next) => {
    try {
        const track = await ReleaseService.getSingleTrack(req.params.id);
        const trackDelResponse = await S3ervice.deleteTrack(track.title);
        const sampleDelResponse = await S3ervice.deleteSample(track.sample)
        const response = await ReleaseService.deleteSingleTrack(req.params.id);
        res.status(200).json({response, trackDelResponse, sampleDelResponse});
    } catch (error) {
        next(error)
    }
})


module.exports = releasesRouter;