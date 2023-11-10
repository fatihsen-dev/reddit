import ListItem from "./ListItem";

const pages = [
  { label: "Halterciler", href: "/halterciler" },
  { label: "Webciler", href: "/webciler" },
  { label: "Cart Curt", href: "/cart-curt" },
];

export default function GroupList() {
  return (
    <div className="grid content-start gap-2">
      <h3 className="text-sm text-neutral-400">Groups</h3>
      <ul className="grid content-start gap-2">
        {pages.map((el, index) => (
          <ListItem key={index} label={el.label} href={el.href} />
        ))}
      </ul>
    </div>
  );
}
