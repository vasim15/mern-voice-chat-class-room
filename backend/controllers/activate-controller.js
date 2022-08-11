const jimp = require('jimp');
const path = require('path');
const UserDto = require('../dtos/user-dto');
const userService = require('../services/user-service');
class ActivateController {
    async activate (req, res){
        const { name, avatar} = req.body;
        if(!name || !avatar){
            res.status(400).json({message: 'All fielda are required!'})
        }

        const buffer = Buffer.from(
            avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/,''),
            'base64'
        );
        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
        try{
            const jimpResp = await jimp.read(buffer);
            jimpResp.resize(150,jimp.AUTO)
            .write(path.resolve(__dirname, `../storage/${imagePath}`))
        }catch(e){
            console.log(e)
            res.status(500).json({message: 'Could not process the image'});
        }
        const userId = req.user._id;
        try{
            const user = await userService.findUser({_id: userId});
            if(!user){
                res.status(404).json({message: 'User not found!'});
            }
            user.activated = true;
            user.name = name;
            user.avatar = `/storage/${imagePath}`;
            user.save();
            // console.log(user);
            res.status(200).json({user: new UserDto(user), auth:true})
        }catch(e){
            console.log(e);
            res.status(500).json({message: 'Sonmthing went wrong!'});
        }

    }

}
module.exports = new ActivateController();