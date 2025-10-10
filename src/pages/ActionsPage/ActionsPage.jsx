import ActionsCards from "../../components/ActionsCards/ActionsCards";
import ActionsIntro from "../../components/ActionsIntro/ActionsIntro";
import Footer from "../../components/Footer/Footer";

import Header from "../../components/Header/Header";
import OurProductExample from "../../components/OurProductExample/OurProductExample";
import TariffQuestions from "../../components/TariffQuestions/TariffQuestions";
import UserQuestions from "../../components/UserQuestions/UserQuestions";

const ActionsPage = () => {
  return (
    <div>
      <Header />
      <ActionsIntro />
        <OurProductExample/>
      <ActionsCards/>
      <TariffQuestions />
      <UserQuestions />
      <Footer />
    </div>
  );
};

export default ActionsPage;
