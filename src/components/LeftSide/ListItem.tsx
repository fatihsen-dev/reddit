import Link from "next/link";

interface IProps {
  label: string;
  href: string;
}

export default function ListItem({ label, href }: IProps) {
  return (
    <li className="w-full">
      <Link
        className="flex w-full rounded-md border border-neutral-400/10 bg-neutral-400/10 p-2.5  py-1.5 dark:bg-neutral-400/5"
        href={href}
      >
        {label}
      </Link>
    </li>
  );
}
