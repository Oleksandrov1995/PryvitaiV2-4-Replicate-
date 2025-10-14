import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import OurProductExample from "../../components/OurProductExample/OurProductExample";
import TariffIntro from "../../components/TariffIntro/TariffIntro";
import TariffPlan from "../../components/TariffPlan/TariffPlan";
import TariffQuestions from "../../components/TariffQuestions/TariffQuestions";
import UserQuestions from "../../components/UserQuestions/UserQuestions";

const TariffPlanPage = () => {
  return (
    <div>
      <Header />
      <TariffIntro />
      <OurProductExample />
      <TariffPlan />
      <TariffQuestions />
      <UserQuestions />
      <Footer />
    </div>
  );
};

export default TariffPlanPage;
