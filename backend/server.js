require("dotenv").config();
const express = require("express");
const dbConnect = require("./database");
const routes = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ACTIONS = require("./actions");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;
dbConnect();
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(
  express.json({
    limit: "8mb",
  })
);
app.use("/storage", express.static("storage"));
app.use(routes);

//socket connection
const socketUserMaping = {};
io.on("connection", (socket) => {
  console.log("newConnection", socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMaping[socket.id] = user;
    //new map
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMaping[clientId],
      });
    });
    socket.join(roomId);
  });
  //handle relay ice
  socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  });
  //handle relay sdp session description
  socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  });

  //handle mute/unmute
  
  socket.on(ACTIONS.MUTE, ({roomId, userId})=>{
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    clients.forEach((clientId)=>{
      io.to(clientId).emit(ACTIONS.MUTE, {
        peerId: socket.id,
        userId
      })
    })
  })

   socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
     const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
     clients.forEach((clientId) => {
       io.to(clientId).emit(ACTIONS.UN_MUTE, {
         peerId: socket.id,
         userId,
       });
     });
   });

  //socket leave
  const leaveRoomHandle = ({ roomId }) => {
    console.log('dissconnection');
    const { rooms } = socket;
    Array.from(rooms).forEach((roomId) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMaping[socket.id]?.id,
        });
        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMaping[clientId]?.id,
        });
      });
      socket.leave(roomId);
    });
    delete socketUserMaping[socket.id];
  };
  socket.on(ACTIONS.LEAVE, leaveRoomHandle);
  socket.on("disconnecting", leaveRoomHandle);
});

server.listen(PORT, () => console.log(`server running on ${PORT}`));
