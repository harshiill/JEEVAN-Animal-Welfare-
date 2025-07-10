'use client';

import dynamic from 'next/dynamic';

// Dynamically import RescueMap with SSR disabled
const RescueMap = dynamic(() => import('./RescueMap'), { ssr: false });

export default RescueMap;
