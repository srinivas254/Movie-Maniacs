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
import { ProtectedRoute } from "./protectedRoute.jsx";
import { OAuthSuccess } from "./oAuthSuccess.jsx";
import { EditProfileCard } from "./editProfile.jsx";
import { SetPassword } from "./setAPassword.jsx";
import { ResetPassword } from "./resetAPassword.jsx";
import { DeleteAccount } from "./deleteAccount.jsx";
import { ForgotPassword } from "./forgot-Password.jsx";
import { ResetNewPassword } from "./resetNewPassword.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/reset-password" element={<ResetNewPassword />} />
      <Route
        element={
          <ProtectedRoute>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/settings" element={<UserSettings />}>
          <Route path="edit-profile" element={<EditProfileCard />} />
          <Route path="set-password" element={<SetPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="delete-account" element={<DeleteAccount />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
