import React from "react";
import { useHistory } from 'react-router-dom'
import "./Home.module.css";
import Card from "../../components/shared/card/Card";
import Button from "../../components/shared/button/Button";
import style from "./Home.module.css";

const Home = () => {
  const history = useHistory();
  const startRegister = () => {
      history.push('/authenticate');
  };
  return (
    <div className={style.cardWrapper}>
      <Card title="Welcome to CodersHouse" icon="logo">
        <p className={style.text}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro
          adipisci repellendus explicabo vel delectus, iure similique corrupti
          vero labore, velit fugiat, et tempore modi numquam ullam nemo fuga
          esse quae?
        </p>
        <div>
          <Button onClick={startRegister} text={`Let's Go`} />
        </div>
        <div className={style.singinWrapper}>
          <span className={style.hasInvite}>Have you invite Text</span>
        </div>
      </Card>
    </div>
  );
};

export default Home;
