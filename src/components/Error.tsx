export default function Error() {
  return (
    <div className="absolute inset-0 z-40 flex h-full w-full flex-col items-center justify-center gap-5 bg-background">
      <h1 className="text-5xl font-normal text-red-500">Oopps!!</h1>
      <p>A problem has occurred, refresh the page after a few minutes</p>
    </div>
  );
}
