import React from "react";
import "./Main.css";
import MainButtons from "../../butttons/mainButtons/MainButtons";

const Main= () => {
  

  return (
    <div className="main">
        <h1 className="main-title">Ваші свята, наша турбота!</h1>
      <h4 className="main-subtitle">Створюйте незабутні привітання з легкістю. Персоналізуйте, плануйте та надсилайте унікальні листівки для всіх особливих подій.</h4>
      
      <MainButtons />

    </div>

  );
};
export default Main;