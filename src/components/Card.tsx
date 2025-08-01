import { projects } from "../data/projects";

export const Card = () => {
  return (
    <>
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-[#050505] border border-[#3a0081] rounded-lg p-6 flex flex-col items-center transform transition-transform duration-300 hover:scale-105"
        >
          <div className="w-full flex justify-center">
            <img
              src={project.image}
              alt={project.title || "Imagem do projeto"}
              className="w-full max-w-xs h-48 object-cover rounded-xl border border-gray-800 shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="flex flex-col gap-3 mt-6 text-center max-w-[300px] md:max-w-md">
            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
            <p className="text-sm text-gray-300">{project.description}</p>

            <div className="flex justify-center gap-6 mt-4">
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <img
                  src="/assets/git-icon.svg"
                  alt="Ver código"
                  className="w-6 h-6 transition-transform duration-300 hover:scale-125"
                />
              </a>

              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <img
                  src="/assets/preview-icon.svg"
                  alt="Ver projeto"
                  className="w-6 h-6 transition-transform duration-300 hover:scale-125"
                />
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
