const RoomModal = require('../models/room-model')
class RoomService {
    async create(payload){
        const { topic, roomType, ownerId} = payload;
        const room = await RoomModal.create({
            topic,
            roomType,
            ownerId,
            speakers: [ownerId],
        });
        return room;
    }
    async getAllRooms(type){
        const rooms = await RoomModal.find({roomType: {$in:type}})
        .populate('speakers')
        .populate('ownerId')
        .exec()
        return rooms;
    }
    async getRoom(roomId){
        const room = await RoomModal.findOne({_id: roomId})
        return room
    }

}
module.exports = new RoomService();