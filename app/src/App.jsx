import app from './firebase/firebase';
import RegistrationPage from './components/pages/RegistrationPage';
import Home from './components/pages/Homepage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import { MentorSearchForm } from './components/pages/mentor-search-form';
import FileHomePage from './components/pages/FileHomePage';
import FileAddDocument from './components/pages/fileAddDocument';
import InserireVideo from './components/pages/InserireVideo';
import Video from './components/pages/Video';  // Componente per la lista dei video
import DettaglioVideo from './components/pages/DettaglioVideo';
import HomePageUtente from './components/pages/HomePageUtente'
import ModificaProfilo from './components/pages/ModificaProfilo';
import {DettagliUtenteWrapper} from './components/pages/DettaglioUtente';
import { AuthProvider } from './auth/auth-context';
import PrivateRoutes from './PrivateRoutes';
import DettaglioProfilo from './components/pages/DettaglioProfilo';
import MatchingResultPage from './components/pages/MatchingResultPage';


function App() {
  const db = app;
  console.log(db);
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutes roles={[]}/>}>
            <Route path="/" element={<Home />} /> 
            <Route path="/register" element={<RegistrationPage/>}/>
            <Route path="/login" element={<LoginPage/>}/> 
        </Route>
        <Route element={<PrivateRoutes roles={["mentor","mentee"]}/>}>
          <Route path="/dettagli/:userId" element={<DettagliUtenteWrapper/>} />
          <Route path="/HomePageUtente" element={<HomePageUtente />} />
          <Route path="/profile" element={<DettaglioProfilo/>} />
          <Route path="/edit-profile" element={<ModificaProfilo />}/>
          <Route path="/mentorsearch" element={<MentorSearchForm />} />
          <Route path="/contents" element={<FileHomePage />} />
          <Route path="/videos" element={<Video />} />
          <Route path="/video/:id" element={<DettaglioVideo />} />
          <Route path="/matchingpage" element={<MatchingResultPage/>} />
        </Route>
        <Route element={<PrivateRoutes roles={["mentor"]}/>}>
          <Route path="/addfile" element={<FileAddDocument />} />
          <Route path="/InserireVideo" element={<InserireVideo />} />
        </Route>
       </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
