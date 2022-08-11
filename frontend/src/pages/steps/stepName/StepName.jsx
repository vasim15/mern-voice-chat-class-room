import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import style from "./StepName.module.css";

import { setName } from '../../../store/activateSlice'
import Card from '../../../components/shared/card/Card'
import TextInput from '../../../components/shared/textInput/TextInput'
import Button from '../../../components/shared/button/Button'


const StepName = ({onNext}) => {
  const dispatch = useDispatch()
  const { name } = useSelector(state=>state.activate);
    const [fullName, setFullName] = useState(name);
    const nextStep = () => {
      if(!fullName) return
      dispatch(setName(fullName))
      onNext();
    }
    return (
      <Card title="What's Your full Name?" icon='goggle-emoji' >
        <TextInput
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <p className={style.paragraph}>
          People use real names at codershouse :!
        </p>
        <div>
            <Button onClick={nextStep} text='Next' />
        </div>
      </Card>
    );
}

export default StepName
