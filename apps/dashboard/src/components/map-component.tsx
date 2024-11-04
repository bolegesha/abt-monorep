'use client'

import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLngExpression } from 'leaflet'

const customIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAzMiA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTE2IDQ4QzE2IDQ4IDMyIDMxLjY3MzQgMzIgMTZDMzIgNy4xNjM0NCAyNC44MzY2IDAgMTYgMEM3LjE2MzQ0IDAgMCA3LjE2MzQ0IDAgMTZDMCAzMS42NzM0IDE2IDQ4IDE2IDQ4WiIgZmlsbD0iIzAwNzFFMyIvPgo8Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSI4IiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48]
})

interface City {
    name: string
    coordinates: LatLngExpression
    address: string
    phone: string
}

const cities: City[] = [
    // Your cities array...
]

export default function MapComponent() {
    const [selectedCity, setSelectedCity] = useState<City | null>(null)

    return (
        <div className="relative h-full">
            <div style={{ height: '100%', width: '100%' }}>
                <MapContainer
                    center={[48.0196, 66.9237]}
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {cities.map((city) => (
                        <Marker
                            key={city.name}
                            position={city.coordinates}
                            icon={customIcon}
                            eventHandlers={{
                                click: () => setSelectedCity(city),
                            }}
                        >
                            <Popup>{city.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
            {selectedCity && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full m-4 shadow-xl">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">{selectedCity.name}</h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Address:</h3>
                                <p className="text-gray-600">{selectedCity.address}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700">Phone:</h3>
                                <p className="text-gray-600">{selectedCity.phone}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedCity(null)}
                            className="mt-6 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
} 