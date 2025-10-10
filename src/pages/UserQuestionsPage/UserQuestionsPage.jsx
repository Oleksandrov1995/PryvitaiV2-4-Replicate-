import MainButtons from "../../butttons/mainButtons/MainButtons";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import UserQuestions from "../../components/UserQuestions/UserQuestions";

export const UserQuestionsPage = () => {
  return (
    <div>
        <Header />
      <UserQuestions/>
      <MainButtons/>
      <Footer/>
    </div>
  );
}