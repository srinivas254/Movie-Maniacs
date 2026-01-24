import { Routes, Route } from "react-router-dom";
import { HomePage } from "./home.jsx";
import { AuthLayout } from "./authLayout.jsx";
import { Login } from "./loginPage.jsx";
import { Register } from "./registerPage.jsx";
import { CollectionsPage } from "./collectionsPage.jsx";
import { ExplorePage } from "./explorePage.jsx";
import { UserProfile } from "./userProfile.jsx";
import { UserSettings } from "./userSettings.jsx";
import { VerifyOtp } from "./verifyOtp.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />}/>
      <Route element={<AuthLayout />}>
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<UserSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
