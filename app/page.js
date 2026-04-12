'use client';

import React from 'react';
import HeadFootLayout from "@/app/headFootLayout";
import HomeOne from '@/components/home/HomeOne';
import HomeTwo from '@/components/home/HomeTwo';
import HomeThree from '@/components/home/HomeThree';
import HomeFour from '@/components/home/HomeFour';
import HomeFive from '@/components/home/HomeFive';
import HomeSix from '@/components/home/HomeSix';

/**
 * Section map:
 *  HomeOne   → Hero (full-screen background + CTA)
 *  HomeTwo   → Stats Bar + Mission / Welcome
 *  HomeThree → Core Modules (8 cards)
 *  HomeFour  → How It Works + Subscription Plans
 *  HomeFive  → Flagship Initiatives + Franchise & MLM
 *  HomeSix   → Testimonials + About + Contact / Helpline
 */

const Home = () => (
  <>
    <HeadFootLayout>
      {/* Page offset — accounts for TopBar (~32px) + MainNav (64px) + tricolor strip (4px) */}
      <main>
        <HomeOne />
        <HomeTwo />
        <HomeThree />
        <HomeFour />
        <HomeFive />
        <HomeSix />
      </main>
    </HeadFootLayout>
  </>
);

export default Home;