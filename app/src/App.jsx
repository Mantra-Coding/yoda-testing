import app from './firebase/firebase';
import RegistrationPage from './components/pages/RegistrationPage';
import Home from './components/pages/Homepage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import { MentorSearchForm } from './components/pages/mentor-search-form';
import FileHomePage from './components/pages/FileHomePage';
import FileAddDocument from './components/pages/fileAddDocument';
//import ModifyProfile from './components/pages/ModifyProfile';
import InserireVideo from './components/pages/InserireVideo';
import Video from './components/pages/Video';  // Componente per la lista dei video
import DettaglioVideo from './components/pages/DettaglioVideo';
import HomePageUtente from './components/pages/HomePageUtente'
import MentorProfileForm from './components/pages/ModifyProfile';
import {DettagliUtenteWrapper} from './components/pages/DettaglioUtente';
import { AuthProvider } from './auth/auth-context';
import PrivateRoutes from './PrivateRoutes';
import DettaglioProfilo from './components/pages/DettaglioProfilo';

function App() {
  const db = app;
  console.log(db);
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/register" element={<RegistrationPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route element={<PrivateRoutes/>}>
          <Route path="/profile" element={<DettaglioProfilo />}/>
          <Route path="/dettagli/:userId" element={<DettagliUtenteWrapper/>} />
          <Route path="/HomePageUtente" element={<HomePageUtente />} />
          <Route path="/profile" element={<MentorProfileForm/>}/>
          <Route path="/mentorsearch" element={<MentorSearchForm />} />
          <Route path="/contents" element={<FileHomePage />} />
          <Route path="/addfile" element={<FileAddDocument />} />
          <Route path="/InserireVideo" element={<InserireVideo />} />
          <Route path="/videos" element={<Video />} />
          <Route path="/video/:id" element={<DettaglioVideo />} />
        </Route>
       </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
