const addressRouter = require('express').Router();
const AddressService = require('../services/addressService');
const { AuthFromCookie } = require('../services/jwtService');


// Protecting the endpoint
addressRouter.use(AuthFromCookie);

// GET user's address
addressRouter.get('/:id', async(req,res,next) => {
    try {
        const address = await AddressService.getAddress(req.params.id);
        res.status(200).json(address);
    } catch (error) {
        next(error)
    }
});


addressRouter.post('/', async(req,res,next) => {
    try {
        const address = await AddressService.addAddress(req.body);
        res.status(201).json(address);
    } catch (error) {
        next(error)
    }
});

addressRouter.put('/:id', async(req,res,next) => {
    try {
        const address = await AddressService.updateAddress(req.body,req.params.id);
        res.status(201).json(address)
    } catch (error) {
        next(error)
    }
});

addressRouter.delete('/:id', async(req,res,next) => {
    try {
        const response = await AddressService.deleteAddress(req.params.id);
        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
})


module.exports = addressRouter;