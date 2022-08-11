import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./StepAvatar.module.css";
import Card from "../../../components/shared/card/Card";
import TextInput from "../../../components/shared/textInput/TextInput";
import Button from "../../../components/shared/button/Button";
import { setAvatar } from "../../../store/activateSlice";
import { activate } from "../../../http/index";
import { setAuth } from "../../../store/authSlice";
import Loader from "../../../components/shared/loader/Loader";

const StepAvatar = () => {
  const [loading, setLoading] = useState(false);
  const [unMounted, setUnMounted] = useState(false);
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state) => state.activate);
  const [image, setImage] = useState("images/monkey-avatar.png");
  const captureImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  };
  const submit = async () => {
    if (!name || !avatar) return;
    setLoading(true);
    try {
      const { data } = await activate({ name, avatar });
      if(data.auth){
        if (!unMounted) {
          dispatch(setAuth(data));
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    return () => {
      setUnMounted(true);
    };
  }, []);

  if(loading)return <Loader message='Activation in progress...' />;
  return (
    <div>
      <Card title={`Okey, ${name}`} icon="monkey-emoji">
        <p className={style.subHeading}>how's this Photo</p>
        <div className={style.avatarWrapper}>
          <img src={image} className={style.avatarImage} alt="avatar" />
        </div>
        <div>
          <input
            onChange={captureImage}
            id="avatarInput"
            className={style.avatarInput}
            type="file"
          />
          <label htmlFor="avatarInput" className="avatarLabel">
            Choose a different Photo
          </label>
        </div>
        <div>
          <Button onClick={submit} text="Next" />
        </div>
      </Card>
    </div>
  );
};

export default StepAvatar;
