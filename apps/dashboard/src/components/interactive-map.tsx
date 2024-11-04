'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamic import of MapContainer to avoid SSR issues
const MapComponent = dynamic(
  () => import('react-leaflet').then((mod) => {
    return import('./map-component');
  }),
  {
    ssr: false,
    loading: () => <div>Loading map...</div>
  }
);

export default function InteractiveMap() {
  return <MapComponent />
}