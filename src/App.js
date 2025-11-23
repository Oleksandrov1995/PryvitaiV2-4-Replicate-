import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import { GenerateText} from './pages/GenerateText/GenerateText';
import UserPage from './pages/UserPage/UserPage';
import { StylizePhotoForPostcard } from './pages/StylizePhotoForPostcard/StylizePhotoForPostcard';
import { GalleryPage } from './pages/Gallery/GalleryPage';
import { MainPage } from './pages/MainPage/MainPage';
import { GenerateFluffyGreeting } from './pages/GenerateFluffyGreeting/GenerateFluffyGreeting';
import SignUpPage from './pages/Registration/SignUpPage/SignUpPage';
import SignInPage from './pages/Registration/SignIn/SignInPage';
import ResetPasswordPage from './pages/Registration/ResetPasswordPage/ResetPasswordPage';
import EditorPage from './pages/EditorPage/EditorPage';
import { ContactUsPage } from './pages/ContactUsPage/ContactUsPage';
import { UserQuestionsPage } from './pages/UserQuestionsPage/UserQuestionsPage';
import { AgreementPage } from './pages/AgreementPage/AgreementPage';
import ScrollToTop from './utils/ScrollToTop';
import { UserTipsPage } from './pages/UserTipsPage/UserTipsPage';
import TariffPlanPage from './pages/TariffPlanPage/TariffPlanPage';
import ActionsPage from './pages/ActionsPage/ActionsPage';
import { BalancePage } from './pages/BalancePage/BalancePage';
import { AboutUsPage } from './pages/AboutUsPage/AboutUsPage';
import { CalendarPage } from './pages/CalendarPage/CalendarPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage/PaymentSuccessPage';
import PaymentErrorPage from './pages/PaymentErrorPage/PaymentErrorPage';
import { UniversalGreetingPage } from './pages/UniversalGreetingPage/UniversalGreetingPage';
// import EditorWrapper from './components/Editor/EditorWrapper';

function App() {
  return (
    <Router>
        <ScrollToTop/>
      <div className="App">
        <Routes>
    <Route path="/" element={<MainPage />} />
    <Route path="/signUp" element={<SignUpPage/>} />
    <Route path="/SignIn" element={<SignInPage/>} />
    <Route path="/UserPage" element={<UserPage/>} />
    <Route path="/GenerateText" element={<GenerateText/>} />
    <Route path="/GenerateFluffyGreeting" element={<GenerateFluffyGreeting/>} />
    <Route path="/StylizePhotoForPostcard" element={<StylizePhotoForPostcard/>} />
    <Route path="/editor" element={<EditorPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage/>} />
    <Route path="/gallery" element={<GalleryPage/>} />
    <Route path="/contact" element={<ContactUsPage />} />
    <Route path="/userQuestions" element={<UserQuestionsPage />} />
    <Route path="/userTips" element={<UserTipsPage/>} />
    <Route path="/agreement" element={<AgreementPage/>} />
    <Route path="/tariffs" element={<TariffPlanPage/>} />
    <Route path="/actions" element={<ActionsPage/>} />
    <Route path="/balance" element={<BalancePage/>} />
    <Route path='/aboutUs' element={<AboutUsPage />} />
    <Route path="/calendar" element={<CalendarPage/>} />
    <Route path="/payment-success" element={<PaymentSuccessPage/>} />
    <Route path="/payment-error" element={<PaymentErrorPage/>} />
    <Route path="/UniversalGreetingPage" element={<UniversalGreetingPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
