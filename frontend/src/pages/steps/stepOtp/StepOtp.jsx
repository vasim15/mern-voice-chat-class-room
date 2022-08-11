import React, { useState } from "react";
import { useSelector,useDispatch } from "react-redux";

import style from "./StepOtp.module.css";

import { verifyOtp } from '../../../http'
import Card from "../../../components/shared/card/Card";
import TextInput from "../../../components/shared/textInput/TextInput";
import Button from "../../../components/shared/button/Button";
import { setAuth } from '../../../store/authSlice'

const StepOtp = ( ) => {
  const dispatch = useDispatch()
  const { phone, hash } = useSelector(state=>state.auth.otp)
  const [otp, setOtp] = useState("");
  const submit = async () => {
    if(!otp)return;
    try{
      const { data } = await verifyOtp({phone, hash, otp })
      dispatch(setAuth(data))
    }catch(e){
      console.log(e)
    }
  };
  return (
    <div className="cardWrapper">
      <Card title="enter the code we just text you" icon="lock-emoji">
        <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} />
        <div>
          <div className={style.actionButtonWrap}>
            <Button onClick={submit} text="Next" />
          </div>
          <p className={style.bottomParagraph}>
            By entering your number your're aggreeing to our Terms of Service
            and Privacy Policy. Thanks!
          </p>
        </div>
      </Card>
    </div>
  );
};

export default StepOtp;
