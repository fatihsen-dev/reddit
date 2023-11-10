"use client";

interface IProps {
  params: { slug: string };
}

export default function Page({ params: { slug } }: IProps) {
  return <div>{slug}</div>;
}
