
import app from './firebase/firebase'
//import LoginPage from './components/pages/LoginPage'
import RegistrationPage from './components/pages/RegistrationPage';


function App() {
  const db = app;
  console.log(db);


  return (
      

      <div>      
        <RegistrationPage/>   
    </div>

    
  )
}

export default App
