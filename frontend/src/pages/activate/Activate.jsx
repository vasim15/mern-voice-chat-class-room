import React,{useState} from 'react'
import StepName from '../steps/stepName/StepName'
import StepAvtar from '../steps/stepAvatar/StepAvatar'

const steps = {
    1: StepName,
    2: StepAvtar
}
const Activate = () => {
    const [step, setStep] = useState(1);
    const Step = steps[step];
    const onNext = ()=>{
        setStep(step + 1);
    }
    return (
      <div className="cardWrapper">
        <Step onNext={onNext} />
      </div>
    );
}

export default Activate
