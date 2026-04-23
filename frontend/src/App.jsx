import { Routes, Route } from "react-router-dom";
import { HomePage } from "./Home Page/home.jsx";
import { AuthLayout } from "./Authentication/authLayout.jsx";
import { Login } from "./Authentication/loginPage.jsx";
import { Register } from "./Authentication/registerPage.jsx";
import { CollectionsPage } from "./User Page/collectionsPage.jsx";
import { ExplorePage } from "./User Page/explorePage.jsx";
import { UserProfile } from "./User Page/userProfile.jsx";
import { UserSettings } from "./User Page/userSettings.jsx";
import { VerifyOtp } from "./Authentication/verifyOtp.jsx";
import { ProtectedRoute } from "./Authentication/protectedRoute.jsx";
import { OAuthSuccess } from "./Authentication/oAuthSuccess.jsx";
import { EditProfileCard } from "./User Page/User settings/editProfile.jsx";
import { SetPassword } from "./User Page/User settings/setAPassword.jsx";
import { ResetPassword } from "./User Page/User settings/resetAPassword.jsx";
import { DeleteAccount } from "./User Page/User settings/deleteAccount.jsx";
import { ForgotPassword } from "./Authentication/forgot-Password.jsx";
import { ResetNewPassword } from "./Authentication/resetNewPassword.jsx";
import { NotFound } from "./NotFound.jsx";
import { AddMoviePage } from "./Admin/movieAdd.jsx";
import { UpdateMoviePage } from "./Admin/updateMovie.jsx";
import { AdminPanel } from "./Admin/adminpanel.jsx";
import { MovieDetailsPage } from "./Movie Page/movieDetails.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/reset-password" element={<ResetNewPassword />} />
      <Route path="/movies/update" element={<UpdateMoviePage />} />
      <Route path="/admin" element={<AdminPanel />}>
        <Route path="add-movie" element={<AddMoviePage />} />
        <Route path="update-movie/:id" element={<UpdateMoviePage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/movie/:slug" element={<MovieDetailsPage />}  />
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
