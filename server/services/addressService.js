const AddressModel = require('../db/addressModel');
const Address = new AddressModel();

module.exports = {

    addAddress: async(data) => {
        const response = await Address.createAddress(data);
        return response;
    },

    getAddress: async(data) => {
        const response = await Address.getAddress(data);
        return response;
    },

    updateAddress: async(data, user_id) => {
        const response = await Address.updateAddress(data,user_id);
        return response;
    },

    deleteAddress: async(user_id) => {
        const response = await Address.deleteAddress(user_id);
        return response
    }

}