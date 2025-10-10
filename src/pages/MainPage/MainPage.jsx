import React from "react";
import Header from "../../components/Header/Header";
import Main from "../../components/Main/Main";
import TariffPlan from "../../components/TariffPlan/TariffPlan";
import ContactUs from "../../components/ContactUs/ContactUs";
import Footer from "../../components/Footer/Footer";
import Calendar from "../../components/Calendar";

export const MainPage= () => {
  

  return (
    <div >
      <Header/>
    <Main/>
    <Calendar/>
    <TariffPlan/>
    <Footer/>
    </div>

  );
};
