import { projects } from "../data/projects";

export const Card = () => {
  return (
    <>
      {projects.map((project) => (
        <div
          className="bg-[#050505] py-4 px-6 border border-white rounded-md"
          key={project.id}
        >
          <div>
            <img src={project.image} alt="" className="w-full" />
          </div>
          <div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </div>
        </div>
      ))}
    </>
  );
};
