import {Routes,Route} from "react-router-dom";

import { HomePage } from "./home.jsx";
import { AuthPage } from "./auth.jsx";
import { Login } from "./loginPage.jsx";
import { Register } from "./registerPage.jsx";
import { CollectionsPage } from "./collectionsPage.jsx";


function App() {
  return(
    <Routes>
      <Route path="/" element={<HomePage/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/explore" element={<AuthPage/>} />
      <Route path="/collections" element={<CollectionsPage/>} />
    </Routes>
  )
}

export default App
