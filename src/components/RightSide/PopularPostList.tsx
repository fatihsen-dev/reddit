import PostItem from "./PostItem";

const pages = [
  {
    photo: "https://github.com/fatihsen-dev.png",
    title: "Post Title One",
    slug: "post-title-one",
    likes: 20,
    comments: 10,
  },
  {
    photo: "https://github.com/cesii.png",
    title: "Post Title Two",
    slug: "post-title-two",
    likes: 20,
    comments: 10,
  },
];
export default function PopularPostList() {
  return (
    <div className="grid content-start gap-3 rounded-md border border-neutral-400/10 bg-neutral-400/5 p-3 dark:border-neutral-400/5 dark:bg-neutral-400/[.025]">
      <h3 className="text-sm text-neutral-500">Popular Posts</h3>
      <ul className="grid content-start gap-3">
        {pages.map((el, index) => (
          <PostItem
            key={index}
            photo={el.photo}
            slug={el.slug}
            title={el.title}
            likes={el.likes}
            comments={el.comments}
          />
        ))}
      </ul>
    </div>
  );
}
