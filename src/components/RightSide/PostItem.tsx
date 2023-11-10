import Link from "next/link";
import Avatar from "~/components/Avatar";
interface IProps {
  photo: string;
  title: string;
  slug: string;
  likes: number;
  comments: number;
}

export default function PostItem({
  photo,
  title,
  slug,
  likes,
  comments,
}: IProps) {
  return (
    <li>
      <Link
        className="flex w-full items-center gap-2.5 rounded-md border border-neutral-400/20 bg-neutral-400/10 p-2 py-1.5 dark:border-neutral-400/5 dark:bg-neutral-400/[0.025]"
        href={`/r/${slug}`}
      >
        <Avatar url={photo} className="!h-12 !w-12 !rounded !px-0" />
        <div className="flex flex-col">
          <div>{title}</div>
          <span className="text-sm font-light opacity-50">{`likes: ${likes}, comments: ${comments}`}</span>
        </div>
      </Link>
    </li>
  );
}
