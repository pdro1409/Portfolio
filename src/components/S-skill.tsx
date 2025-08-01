import React, { useState } from "react";
import { skills } from "../data/skills";

export default function SSkill() {
  const [text, setText] = useState(
    "*passe o cursor do mouse no card para ler*"
  );
  return (
    <div className="bg-[#080808]">
      <section
        id="skill"
        className=" relative z-10 container max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 place-items-center gap-10 text-white mt-14 md:mt-20 p-4 md:px-10"
      >
        <div className="hidden md:flex  flex-col min-h-[300px] justify-center items-start">
          <h2 className="text-2xl font-semibold mb-10">Conhecimentos.</h2>
          <div className="rounded-md max-w-[300px]">
            <p className="text-base">{text}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <div
              className="bg-[#050505] py-4 px-6 border border-[#3a0081] rounded-md transform transition-transform duration-300 hover:scale-110"
              key={skill.id}
              onMouseEnter={() => setText(skill.description)}
              onMouseLeave={() =>
                setText("*passe o cursor do mouse no card para ler*")
              }
            >
              <img src={skill.image} alt="imagem" className="w-20 h-20" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
