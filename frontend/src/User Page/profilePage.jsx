import { UserProfile } from "./userProfile";
import { UserInterestedMovies } from "./userInterestedMovies";
import { MyReviewsAndPublicCollections } from "./myReviewsAndPublicCollections";

export function ProfilePage() {
  return (
    <div className="min-h-screen text-white flex gap-10 p-8 pt-24">
      <UserProfile />

      <MyReviewsAndPublicCollections />

      <UserInterestedMovies />
    </div>
  );
}