const UserModel = require('../db/userModel');
const User = new UserModel();

const bcrypt = require('bcryptjs');
const createError = require('http-errors')


module.exports = {

    getAllUsers: async() => {
        const response = await User.getAllUsers();
        return response;
    },

    getUserByID: async(id) => {
        const response = await User.getUserById(id);
        return response;
    },

    addUser: async({username, password, email, ip, stripe_id}) => {
        const response = await User.addUser(username, password, email, ip, stripe_id);
        return response;
    },

    updateUser: async(id,params) => {
        const response = await User.updateUser(id,params);
        return response;
    },
    
    deleteUser: async(id) => {
        const response = await User.deleteUser(id);
        return response;
    },

    loginUser: async({username, password}) => {
        try {
            let user = await User.getUserByName(username)
            if (!user) {
                return createError(404, 'User not found')
            };
            let match = await bcrypt.compare(password, user.password);
            if(!match) {
                return createError(404, 'Password incorrect')
            }

            delete user.password;
            return user;

        } catch (error) {
            return createError(401, 'Wrong Credentials')
        };
        
    }

}