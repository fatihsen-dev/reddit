import NewUserList from "./NewUserList";
import PopularPostList from "./PopularPostList";

export default function RightSide() {
  return (
    <div className="min-w-[300px]">
      <div className="sticky top-20 grid w-full content-start gap-6">
        <NewUserList />
        <PopularPostList />
      </div>
    </div>
  );
}
