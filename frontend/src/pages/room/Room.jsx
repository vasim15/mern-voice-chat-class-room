import React, { useEffect, useState } from "react";
import { useWebRTC } from "../../hooks/useWebRtc";
import style from "./Room.module.css";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {getRoom} from '../../http'

const Room = () => {
  const history = useHistory();
  const { id: roomId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const [room, setRoom] = useState(null);
  const [isMute, setMute] = useState(false);
  

  useEffect(()=>{
    handleMute(isMute, user.id)
  },[isMute])

  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await getRoom(roomId);
      setRoom((prev) => data);
    };
    fetchRoom();
  }, []);

  const handleManualLeave = () => {
    history.push("/rooms");
  };
  const handleMuteClick =(clientId)=>{
    if(clientId !== user.id) return
    setMute((pre)=>!pre)
  }

  return (
    <div>
      <div className="container">
        <button onClick={handleManualLeave} className={style.goBack}>
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span>All voice room</span>
        </button>
      </div>
      <div className={style.clientsWrap}>
        <div className={style.header}>
          <h2 className={style.topic}>{room?.topic}</h2>
          <div className={style.actions}>
            <button className={style.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button onClick={handleManualLeave} className={style.actionBtn}>
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quitly</span>
            </button>
          </div>
        </div>
        <div className={style.clientsList}>
          {clients.map((client) => {
            return (
              <div key={client.id} className={style.client}>
                <div className={style.userHead}>
                  <audio
                    ref={(instance) => provideRef(instance, client.id)}
                    // controls
                    autoPlay
                  ></audio>
                  <img
                    className={style.userAvatar}
                    src={client.avatar}
                    alt="avatar"
                  />
                  <button onClick={()=>{handleMuteClick(client.id)}} className={style.micBtn}>
                    {client.muted ? 
                      <img src="/images/mic-mute.png" alt="mic-mute-icon" /> :
                    <img src="/images/mic.png" alt="mic-icon" />
                    }
                  </button>
                </div>
                <h4>{client.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
