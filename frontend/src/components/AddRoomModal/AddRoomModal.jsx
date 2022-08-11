import React, { useState } from 'react'
import TextInput from '../shared/textInput/TextInput';
import style from './AddRoomModal.module.css';
import {createRoom } from '../../http';
import { useHistory } from 'react-router';


const AddRoomModal = ({onClose}) => {
    const history = useHistory();
    const[roomType, setRoomType] = useState('open');
    const [topic, setTopic]= useState('');
    const createRoomHandler = async () =>{
        try{
            if(!topic)return;
            const {data}= await createRoom({topic, roomType});
            history.push(`/room/${data.id}`);
        }catch(e){
            console.log(e);
        }
    }
    return (
        <div className={style.modalMask}>
            <div className={style.modalBody}>
                <button 
                onClick={onClose}
                className={style.closeButton}
                 >
                     <img src='/images/close.png' alt='close'/>
                </button>
                <div className={style.modalHeader}>
                    <h3 className={style.heading}>
                        Enter the Topicti be disscussed
                    </h3>
                    <TextInput
                    fullwidth='true'
                    value={topic}
                    onChange={e=>setTopic(e.target.value)}
                    />
                    <h2 className={style.subHeading}>Room Types</h2>
                    <div className={style.roomTypes}>
                        <div
                        onClick={()=>setRoomType('open')}
                        className={`${style.typeBox} ${
                            roomType === 'open'
                            ? style.active : ''
                        }`}
                        >
                            <img src='/images/globe.png' alt='open' />
                            <span>Open</span>
                        </div>
                        <div
                        onClick={()=>setRoomType('social')}
                        className={`${style.typeBox} ${
                            roomType === 'social'
                            ? style.active : ''
                        }`}
                        >
                            <img src='/images/social.png'
                            alt='social'
                            />
                            <span>Social</span>
                        </div>
                        <div 
                        onClick={()=>setRoomType('private')}
                        className={`${style.typeBox} ${
                            roomType === 'private'
                            ? style.active : ''
                        }`}
                        >
                            <img src={'/images/lock.png'} alt={'lock'}/>
                            <span>Private</span>
                        </div>
                    </div>
                </div>
                <div className={style.modalFooter}>
                    <h2>
                        Start a room, open to everyone
                    </h2>
                    <button
                    onClick={createRoomHandler}
                    className={style.footerButton}
                    >
                        <img src='/images/celebration.png'
                        alt='celebration'
                        />
                        <span>Let's go</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddRoomModal
