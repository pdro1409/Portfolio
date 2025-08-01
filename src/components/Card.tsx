import { projects } from "../data/projects";

export const Card = () => {
  return (
    <>
      {projects.map((project) => (
        <div
          className="bg-[#050505] py-4 px-6 border border-[#3a0081] rounded-md transform transition-transform duration-300 hover:scale-110"
          key={project.id}
        >
          <div>
            <img src={project.image} alt="" className="w-full" />
          </div>
          <div className="flex flex-col gap-2 mt-4  justify-center max-w-[300px] md:max-w-96">
            <h3 className="font-semibold text-2xl">{project.title}</h3>
            <p className="font-medium text-base">{project.description}</p>
            <div className="flex gap-4 mt-4">
              <a href={project.link}>
                <img
                  src="/assets/git-icon.svg"
                  alt=""
                  className="transform transition-transform duration-300 hover:scale-110"
                />
              </a>

              <a href={project.link}>
                <img
                  src="/assets/preview-icon.svg"
                  alt=""
                  className="transform transition-transform duration-300 hover:scale-110"
                />
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
