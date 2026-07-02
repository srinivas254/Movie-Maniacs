import { Routes, Route } from "react-router-dom";
import { HomePage } from "./Home Page/home.jsx";
import { AuthLayout } from "./Authentication/authLayout.jsx";
import { Login } from "./Authentication/loginPage.jsx";
import { Register } from "./Authentication/registerPage.jsx";
import { CollectionsPage } from "./User Page/collectionsPage.jsx";
import { MyCollections } from "./User Page/myCollections.jsx";
import { SavedCollections } from "./User Page/savedCollections.jsx";
import { ExplorePage } from "./User Page/explorePage.jsx";
import { ProfilePage } from "./User Page/profilePage.jsx";
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
import { PublicUserProfile } from "./User Page/publicUserProfile.jsx";
import { AdminLoginPage } from "./Admin/adminLogin.jsx";
import { AdminProtectedRoute } from "./Admin/adminProtectedRoute.jsx";
import { CollectionDetails } from "./User Page/collectionDetails.jsx";
import { PublicCollectionDetails } from "./User Page/publicCollectionDetails.jsx";
import { GenrePage } from "./User Page/genrePage.jsx";
import { GenreMoviesPage }  from "./User Page/genreMoviesPage.jsx"
import { DecadePage } from "./User Page/decadePage.jsx";
import { DecadeMoviesPage } from "./User Page/decadeMoviesPage.jsx";
import { LanguagePage } from "./User Page/languagePage.jsx";
import { LanguageMoviesPage } from "./User Page/languageMoviesPage.jsx";
import { CountryPage } from "./User Page/countryPage.jsx";
import { CountryMoviesPage } from "./User Page/countryMoviesPage.jsx";
import { OttPage } from "./User Page/ottPage.jsx";
import { PlatformMoviesPage } from "./User Page/ottMoviesPage.jsx";
import { RuntimePage } from "./User Page/runtimePage.jsx";
import { RuntimeMoviesPage } from "./User Page/runtimeMoviesPage.jsx";

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
      <Route
        path="/admin"
        element={
          <AdminProtectedRoute>
            <AdminPanel />
          </AdminProtectedRoute>
        }
      >
        <Route path="add-movie" element={<AddMoviePage />} />
        <Route path="update-movie/:id" element={<UpdateMoviePage />} />
      </Route>
      <Route
        path="/admin-view/movie/:slug"
        element={
          <AdminProtectedRoute>
            <MovieDetailsPage />
          </AdminProtectedRoute>
        }
      />
      <Route path="/admin-view/login" element={<AdminLoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AuthLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/explore/genre" element={<GenrePage />} />
        <Route path="/explore/genre/:genreName" element={<GenreMoviesPage />} />
        <Route path="/explore/decade" element={<DecadePage />} />
        <Route path="/explore/decade/:decadeName" element={<DecadeMoviesPage />} />
        <Route path="/explore/language" element={<LanguagePage />} />
        <Route path="/explore/language/:languageName" element={<LanguageMoviesPage />} />
        <Route path="/explore/country" element={<CountryPage />} />
        <Route path="/explore/country/:countryName" element={<CountryMoviesPage />} />
        <Route path="/explore/runtime" element={<RuntimePage />} />
        <Route path="/explore/runtime/:runtimeRange" element={<RuntimeMoviesPage />} />
        <Route path="/explore/ott" element={<OttPage />} />
        <Route path="/explore/ott/:platformName" element={<PlatformMoviesPage />} />
        <Route path="/movie/:slug" element={<MovieDetailsPage />} />
        <Route path="/collections" element={<CollectionsPage />}>
          <Route path="my-collections" element={<MyCollections />} />
          <Route path="saved" element={<SavedCollections />} />
        </Route>
        <Route path="/collections/my-collections/:collectionName" element={<CollectionDetails />} />
        <Route path="/user/:userName/collections/public/:collectionName" element={<PublicCollectionDetails />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/user/:userName" element={<PublicUserProfile />} />
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
