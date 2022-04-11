const AlbumModel = require('../db/albumModel');
const Album = new AlbumModel();
const TrackModel = require('../db/trackModel');
const Track = new TrackModel();


module.exports = {
    
    // Add album
    createAlbum: async(params) => {
        const response = await Album.createAlbum(params);
        return response;
    },
    // Update album
    updateAlbum: async(id, params) => {
        const response = await Album.updateAlbum(id, params);
        return response;
    },
    // Delete album
    deleteAlbum: async(id) => {
        const response = await Album.deleteAlbum(id);
        return response;
    },
    // Add track
    addTrack: async(album_id,data) => {
        const params = {...data, album_id: album_id};
        const response = await Track.addTrack(params);
        return response
    },
    // Update track
    updateTrack: async(id, params) => {
        const response = await Track.updateTrack(id, params);
        return response
    },
    // Delete tracks
    deleteSingleTrack: async(id) => {
        const response = await Track.deleteSingleTrack(id);
        return response;
    },
    // Delete all tracks from album
    deleteTracks: async(album_id) => {
        const response = await Track.deleteTracksByAlbum(album_id);
        return response;
    },
    // Get albums + tracks 
    getAlbums: async() => {
        let albums = {};
        const albumList = await Album.getAlbums();
        await Promise.all(albumList.map(async (album) => {
             
            album.tracks = await Track.getTracksByAlbum(album.id);
            albums[album.id] = album;
            console.log(albums);
        }));
        return albums;
    },
    // Get single album with tracks
    getSingleAlbum: async(id) => {
        const album = await Album.getAlbumByID(id);
        album.tracks = await Track.getTracksByAlbum(album.id);
        return album;
    },

    getSingleTrack: async(id) => {
        const track = await Track.getSingleTrack(id);
        return track;
    }
}



