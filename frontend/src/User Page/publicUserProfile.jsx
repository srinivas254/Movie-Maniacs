import { PublicUserProfileCard } from "./publicUserProfileCard";
import { UserInterestedMovies } from "./userInterestedMovies";
import { MyReviewsAndPublicCollections } from "./myReviewsAndPublicCollections";

export function PublicUserProfile() {
  return (
    <div className="min-h-screen text-white flex gap-10 p-8 pt-24">
      <PublicUserProfileCard />

      <MyReviewsAndPublicCollections isPublic={true} />

      <UserInterestedMovies isPublic={true} />
    </div>
  );
}