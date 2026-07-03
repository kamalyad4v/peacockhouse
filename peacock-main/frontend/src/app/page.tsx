"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const LandingPage = dynamic(() => import('@/components/LandingPage'), {
  ssr: false,
});

export default function Home() {
  return <LandingPage />;
}
