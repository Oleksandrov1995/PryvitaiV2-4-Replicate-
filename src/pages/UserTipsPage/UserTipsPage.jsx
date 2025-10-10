import MainButtons from "../../butttons/mainButtons/MainButtons";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import UserTips from "../../components/UserTips/UserTips";


export const UserTipsPage = () => {
  return (
    <div>
        <Header />
      <UserTips/>
      <MainButtons/>
      <Footer/>
    </div>
  );
}