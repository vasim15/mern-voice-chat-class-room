import React, {useState} from 'react'
import { useDispatch } from 'react-redux'
import Card from '../../../../components/shared/card/Card'
import TextInput from '../../../../components/shared/textInput/TextInput'
import Button from "../../../../components/shared/button/Button";
import style from '../StepPhoneEmail.module.css';
import { sendOtp } from '../../../../http'
import { setOtp } from '../../../../store/authSlice'

const Phone = ({onNext}) => {
    const dispatch = useDispatch()
    const [phoneNumber, setPhoneNumber] = useState('');
    const submit = async()=>{
        if(!phoneNumber)return
        const {data}= await sendOtp ({
            phone: phoneNumber
        })
        dispatch(setOtp({
          phone: data.phone,
          hash: data.hash
        }))
        
        console.log('Your OTP is ',data?.otp);
        onNext();
    
    }
    return (
      <Card title="Enter your Phone number" icon="phone">
        <TextInput
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div>
          <div className={style.actionButtonWrap}>
            <Button text="Next" onClick={submit} />
          </div>
          <p className={style.bottomParagraph}>
            By entering your number your're aggreeing to our Terms of Service
            and Privacy Policy. Thanks!
          </p>
        </div>
      </Card>
    );
}

export default Phone
