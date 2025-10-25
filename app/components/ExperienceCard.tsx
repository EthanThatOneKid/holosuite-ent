import React from 'react';
import type { Experience } from '../data/experiences';

interface ExperienceCardProps {
  experience: Experience;
  onClick?: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, onClick }) => {
  return (
    <div
      className="card bg-base-100 shadow-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl flex-shrink-0 w-64"
      onClick={onClick}
    >
      <figure className="relative h-36 overflow-hidden">
        <img
          src={experience.thumbnail}
          alt={experience.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <div className="badge badge-primary badge-sm">{experience.duration}</div>
        </div>
      </figure>
      <div className="card-body p-4">
        <h3 className="card-title text-sm">{experience.title}</h3>
        <p className="text-xs opacity-70 line-clamp-2">{experience.description}</p>
        <div className="card-actions justify-start mt-2">
          <div className="badge badge-outline badge-sm">{experience.category}</div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
