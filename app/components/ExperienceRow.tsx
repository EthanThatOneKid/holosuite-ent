import React from 'react';
import ExperienceCard from './ExperienceCard';
import type { Experience } from '../data/experiences';

interface ExperienceRowProps {
  title: string;
  experiences: Experience[];
  onExperienceClick?: (experience: Experience) => void;
}

const ExperienceRow: React.FC<ExperienceRowProps> = ({ title, experiences, onExperienceClick }) => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 px-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
        {experiences.map((experience) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            onClick={() => onExperienceClick?.(experience)}
          />
        ))}
      </div>
    </div>
  );
};

export default ExperienceRow;
