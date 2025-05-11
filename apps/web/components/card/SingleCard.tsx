export default function SingleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white relative rounded-4xl border border-border-theme  px-7.5 py-10 md:w-[230px] lg:w-[295px] w-[330px] xl:w-[330px] flex flex-col gap-4 md:gap-10 shadow hover:shadow-xl hover:scale-105 hover:rounded-[45px] transition-all duration-300">
      <p className="text-2xl md:text-3xl font-medium">{title}</p>
      <p className="text-lg md:text-xl text-text-theme">{description}</p>
    </div>
  );
}
