import { Avatar as AvatarComponent, AvatarImage } from "@radix-ui/react-avatar";
import { AvatarFallback } from "./ui/avatar";

interface IProps {
  fullName?: string;
  url: string;
  className?: string;
}

export default function Avatar({ fullName, url, className }: IProps) {
  return (
    <AvatarComponent
      className={`h-7 w-7 overflow-hidden rounded-full ${className}`}
    >
      <AvatarImage src={url} className="h-full w-full" alt={fullName} />
      <AvatarFallback className={className}>
        {fullName
          ?.split(" ")
          .map((e) => e[0])
          .join("")}
      </AvatarFallback>
    </AvatarComponent>
  );
}
