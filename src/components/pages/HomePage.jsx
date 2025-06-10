import React from 'react';
import { useNavigate } from 'react-router-dom';
import HomeHeroSection from '@/components/organisms/HomeHeroSection';
import HomeFeaturesGrid from '@/components/organisms/HomeFeaturesGrid';
import HomeStatsSection from '@/components/organisms/HomeStatsSection';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HomeHeroSection navigate={navigate} />
        <HomeFeaturesGrid navigate={navigate} />
        <HomeStatsSection />
      </div>
    </div>
  );
}

export default HomePage;