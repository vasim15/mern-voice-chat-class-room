import React, { useEffect, useState } from "react";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import RoomCard from "../../components/RoomCard/RoomCard";
import { getAllRoom } from "../../http";
import style from "./Rooms.module.css";

const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await getAllRoom();
        console.log('data',data);
        setRooms(data);
      } catch (e) {
        console.log(e);
      }
    };
    fetchRooms();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="container">
        <div className={style.roomHeader}>
          <div className={style.left}>
            <span className={style.header}>All voice room</span>
            <div className={style.searchBox}>
              <img src="/images/search-icon.png" alt="search" />
              <input type="text" className={style.searchInput} />
            </div>
          </div>
          <div className={style.right}>
            <button onClick={openModal} className={style.startRoomButton}>
              <img src="/images/add-room-icon.png" alt="add-room" />
              <span>Start a room</span>
            </button>
          </div>
        </div>
        <div className={style.roomList}>
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </div>
      {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Rooms;
