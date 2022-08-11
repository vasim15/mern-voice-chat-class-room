const UserModel = require('../models/user-model');

class UserService {
    async findUser (filter){
        return await UserModel.findOne(filter);
    }
    async createUser (data){
        return await UserModel.create(data);
    }
}

module.exports = new UserService();