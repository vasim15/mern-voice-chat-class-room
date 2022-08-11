import React, { useState } from "react";
import style from "./StepPhoneEmail.module.css";
import Phone from './phone/Phone';
import Email from './email/Email'

const phoneEmailMap = {
  phone: Phone,
  email: Email,
};

const StepPhoneEmail = ({onNext}) => {
  const [type, setType] = useState("phone");
  const Component = phoneEmailMap[type];
  return (
    <div className={style.cardwrapper}>
      <div>
        <div className={style.buttonWrop}>
          <button
            className={`${style.tapButton} ${
              type === "phone" ? style.active : ""
            }`}
            onClick={() => setType("phone")}
          >
            <img src="/images/phone-white.png" alt="phone" />
          </button>
          <button
            className={`${style.tapButton} ${
              type === "email" ? style.active : ""
            }`}
            onClick={() => setType("email")}
          >
            <img src="/images/mail-white.png" alt="email" />
          </button>
        </div>
        <Component onNext={onNext} />
      </div>
    </div>
  );
};

export default StepPhoneEmail;
