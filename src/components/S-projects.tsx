import { Card } from "./Card";

export default function SProjects() {
  return (
    <div className="relative">
      <img
        src="/assets/blur.png"
        alt=""
        className="absolute top-0 left-0 w-full h-full  z-0 opacity-80"
      />
      <section className="relative z-10 container max-w-5xl mx-auto grid grid-cols-1 place-items-center gap-10 text-white mt-14 md:mt-20 p-4 md:px-10">
        <h2 className="text-2xl font-semibold">Projetos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card />
        </div>
      </section>
    </div>
  );
}
