import { useCallback, useEffect, useRef } from "react";
import { ACTIONS } from "../actions";
import { socketInit } from "../socket";
import { useStateWithCallback } from "./useStateWithCallback";
import freeice from "freeice";

export const useWebRTC = (roomId, user) => {
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({});
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  const clientsRef = useRef([]);

  useEffect(() => {
    socket.current = socketInit();
  }, []);

  useEffect(() => {
    const startCapturing = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };
    startCapturing().then(() => {
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
        //socket.id join
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });

    return () => {
      //leave the room
      localMediaStream.current.getTracks().forEach((track) => track.stop());
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);

  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      //if user already connected
      if (peerId in connections.current) {
        return console.warn(
          `you are already connected with ${peerId} (${remoteUser.name})`
        );
      }
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };
      //handle on track on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser.id]) {
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          } else {
            let settled = false;
            const intervel = setInterval(() => {
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
              }
              if (settled) {
                clearInterval(intervel);
              }
            }, 1000);
          }
        });
      };
      //add local track to remote connection
      localMediaStream.current.getTracks().forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });
      //Create Offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        await connections.current[peerId].setLocalDescription(offer);
        //send offet to other client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };
    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, []);

  //handle ice condidate
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });
    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);

  //handle sdp
  useEffect(() => {
    const handleRemoteSdp = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );

      //if session description is type of offer
      if (remoteSessionDescription.type === "offer") {
        //  console.log('connections', connections.current)
        const answere = await connections.current[peerId].createAnswer();
        //  const answere = await connection.createAnswere();
        connections.current[peerId].setLocalDescription(answere);
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answere,
        });
      }
    };

    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

    return () => {
      socket.current.off(ACTIONS.SESSION_DESCRIPTION);
    };
  }, []);
  //handle romove peer

  useEffect(() => {
    const handleRemovePeer = ({ peerId, userId }) => {
      console.log("removing");
      console.log("userId", userId);
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }
      delete connections.current[peerId];
      delete audioElements.current[peerId];
      setClients((lists) => {
        console.log("list", lists);
        return lists.filter((list) => list.id !== userId);
      });
    };
    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
    return () => {
      socket.current.off(ACTIONS.REMOVE_PEER);
    };
  }, []);
 

  useEffect(()=>{
    clientsRef.current = clients;
  }, [clients])


  //handle mute
  useEffect(()=>{
    socket.current.on(ACTIONS.MUTE, ({peerId, userId})=>{
      setMute(true, userId)
    })
    socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
      setMute(false, userId);
    });
    const setMute = (mute, userId)=>{
      const clientIdx = clientsRef.current.map(client=>client.id).indexOf(userId);
      const connectedClients = JSON.parse(JSON.stringify(clientsRef.current))
      if(clientIdx > -1){
        connectedClients[clientIdx].muted = mute;
        setClients(connectedClients);
      }

    }

  },[])

  const addNewClient = useCallback(
    (newClient, cb) => {
      const lookinFor = clients.find((client) => client.id === newClient.id);
      if (lookinFor === undefined) {
        setClients((pre) => [...pre, newClient], cb);
      }
    },
    [clients, setClients]
  );

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };
  //mute Handle
  const handleMute = (isMute, userId) => {
    let settled = false;
    let interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMute;
        if (isMute) {
          socket.current.emit(ACTIONS.MUTE, {
            roomId,
            userId,
          });
        } else {
          socket.current.emit(ACTIONS.UN_MUTE, {
            roomId,
            userId,
          });
        }
        settled = true;
      }
      if (settled) {
        clearInterval(interval);
      }
    },200);
  };
  return { clients, provideRef, handleMute };
};
