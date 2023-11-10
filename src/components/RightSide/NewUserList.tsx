import UserItem from "./UserItem";

const pages = [
  {
    avatar: "https://github.com/fatihsen-dev.png",
    name: "Fatih Şen",
    username: "fatihsen-dev",
  },
  {
    avatar: "https://github.com/cesii.png",
    name: "Nuray Genç",
    username: "cesi",
  },
];

export default function NewUserList() {
  return (
    <div className="grid content-start gap-3 rounded-md border border-neutral-400/10 bg-neutral-400/5 p-3 dark:border-neutral-400/5 dark:bg-neutral-400/[.025]">
      <h3 className="text-sm text-neutral-500">New Users</h3>
      <ul className="grid content-start gap-3">
        {pages.map((el, index) => (
          <UserItem
            key={index}
            avatar={el.avatar}
            name={el.name}
            username={el.username}
          />
        ))}
      </ul>
    </div>
  );
}
