class UserService{

    async activate(activationLink){
        const user = await UserModel.findOne({activationLink})
        if(!user){
            throw ApiError.BadRequest('Некорректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();

    }

}

module.exports = new UserService();