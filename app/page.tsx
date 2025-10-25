'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ExperienceRow from './components/ExperienceRow';
import { experiences, categories, getFeaturedExperience, getExperiencesByCategory } from './data/experiences';
import type { Experience } from './data/experiences';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const featuredExperience = getFeaturedExperience();

  const handleExperienceClick = (experience: Experience) => {
    // TODO: Navigate to experience detail page or start playback
    console.log('Experience clicked:', experience);
  };

  return (
    <div className="min-h-screen bg-base-300">
      {/* Navigation */}
      <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-2xl font-bold">Holosuite</Link>
        </div>
        <div className="flex-none gap-2">
          <Link href="/create" className="btn btn-primary">
            Create Custom Experience
          </Link>
        </div>
      </div>

      {/* Hero/Featured Section */}
      {featuredExperience && (
        <div
          className="hero min-h-[70vh] relative"
          style={{
            backgroundImage: `url(${featuredExperience.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-neutral-content text-left">
            <div className="max-w-2xl">
              <div className="badge badge-primary mb-4">{featuredExperience.category}</div>
              <h1 className="mb-5 text-5xl font-bold">{featuredExperience.title}</h1>
              <p className="mb-5 text-lg">{featuredExperience.description}</p>
              <div className="flex gap-4">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => handleExperienceClick(featuredExperience)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Start Experience
                </button>
                <button className="btn btn-outline btn-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  More Info
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="bg-base-100 sticky top-16 z-40 shadow-md">
        <div className="container mx-auto px-4">
          <div className="tabs tabs-boxed bg-transparent py-4 gap-2">
            {categories.map((category) => (
              <button
                key={category}
                className={`tab ${selectedCategory === category ? 'tab-active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Rows */}
      <div className="py-8">
        {selectedCategory === 'All' ? (
          <>
            <ExperienceRow
              title="Space Adventures"
              experiences={getExperiencesByCategory('Space')}
              onExperienceClick={handleExperienceClick}
            />
            <ExperienceRow
              title="Natural Wonders"
              experiences={getExperiencesByCategory('Nature')}
              onExperienceClick={handleExperienceClick}
            />
            <ExperienceRow
              title="Historical Journeys"
              experiences={getExperiencesByCategory('History')}
              onExperienceClick={handleExperienceClick}
            />
            <ExperienceRow
              title="Fantasy Realms"
              experiences={getExperiencesByCategory('Fantasy')}
              onExperienceClick={handleExperienceClick}
            />
            <ExperienceRow
              title="Urban Escapes"
              experiences={getExperiencesByCategory('Urban')}
              onExperienceClick={handleExperienceClick}
            />
          </>
        ) : (
          <ExperienceRow
            title={`${selectedCategory} Experiences`}
            experiences={getExperiencesByCategory(selectedCategory)}
            onExperienceClick={handleExperienceClick}
          />
        )}
      </div>

      {/* Footer CTA */}
      <div className="bg-base-100 py-16">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-lg opacity-70 mb-8">Create your own custom experience from scratch</p>
          <Link href="/create" className="btn btn-primary btn-lg">
            Create Custom Experience
          </Link>
        </div>
      </div>
    </div>
  );
}
