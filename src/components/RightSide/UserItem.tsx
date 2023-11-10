import Link from "next/link";
import Avatar from "~/components/Avatar";

interface IProps {
  avatar: string;
  name: string;
  username: string;
}

export default function UserItem({ avatar, name, username }: IProps) {
  return (
    <li>
      <Link
        className="flex w-full items-center gap-2.5 rounded-md border border-neutral-400/20 
bg-neutral-400/10 p-2 py-1.5 dark:border-neutral-400/5 dark:bg-neutral-400/[.025]"
        href={`/u/${username}`}
      >
        <Avatar fullName={name} url={avatar} />
        <div>{name}</div>
      </Link>
    </li>
  );
}
