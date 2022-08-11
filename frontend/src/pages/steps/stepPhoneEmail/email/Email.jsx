import React, { useState } from "react";
import Card from "../../../../components/shared/card/Card";
import Button from "../../../../components/shared/button/Button";
import TextInpute from "../../../../components/shared/textInput/TextInput";
import style from "../StepPhoneEmail.module.css";

const Email = ({ onNext }) => {
  const [email, setEmail] = useState("");
  return (
    <Card title="Enter your email id" icon="email-emoji">
      <TextInpute value={email} onChange={e => setEmail(e.target.value)} />
      <div>
        <div className={style.actionButtonWrap}>
          <Button text="Next" onClick={onNext} />
        </div>
        <p className={style.bottomParagraph}>
          By entering your number your're aggreeing to our Terms of Service and
          Privacy Policy. Thanks!
        </p>
      </div>
    </Card>
  );
};

export default Email;
