import GroupList from "./GroupList";
import PageList from "./PageList";

export default function LeftSide() {
  return (
    <div className="min-w-[260px]">
      <div className="sticky top-[6.25rem] grid w-full content-start gap-6">
        <PageList />
        <GroupList />
      </div>
    </div>
  );
}
