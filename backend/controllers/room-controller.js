const RoomDto = require("../dtos/room-dto");
const roomServeice = require("../services/room-serveice");

class RoomController {
  async create(req, res) {
    const { topic, roomType } = req.body;
    console.log(req.user,'asdfghjkl');
    if (!topic || !roomType) {
      return res.status(400).json({ message: "All fieldss are required!" });
    }
    try {
      const room = await roomServeice.create({
        topic,
        roomType,
        ownerId: req.user._id,
      });
      if (!room)return res.status(500).json({ message: "Sonthing went wrong" });
      return res.status(200).json(new RoomDto(room));
    } catch (err) {
      console.log(err);
    }
  }
  async index(req,res){
    try{
      const rooms = await roomServeice.getAllRooms(['open']);
      const allRooms = rooms.map((room) => new RoomDto(room));
      return res.status(200).json(allRooms);

    }catch(e){
      console.log(e);
    }
    

  }
  async show(req,res){
    try {
      const room = await roomServeice.getRoom(req.params.roomId)
      return res.status(200).json(room)
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = new RoomController();
