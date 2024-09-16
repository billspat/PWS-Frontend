// components/Map.tsx
import React, { useRef, useEffect } from "react";
import { useMapbox, MarkerData } from "../hooks/useMapbox";

interface MapProps {
  center: [number, number];
}

const Map: React.FC<MapProps> = ({ center }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, loaded, addMarker } = useMapbox(mapContainer, center, 6);

  const markerData: Record<string, MarkerData> = {
    lansing: {
      latitude: 42.7325,
      longitude: -84.5555,
      name: "Lansing",
      temperature: 68,
    },
    detroit: {
      latitude: 42.3314,
      longitude: -83.0458,
      name: "Detroit",
      temperature: 72,
    },
    belding: {
      latitude: 43.0981,
      longitude: -85.2297,
      name: "Belding",
      temperature: 65,
    },
    grandRapids: {
      latitude: 42.9634,
      longitude: -85.6681,
      name: "Grand Rapids",
      temperature: 70,
    },
    annArbor: {
      latitude: 42.2808,
      longitude: -83.743,
      name: "Ann Arbor",
      temperature: 71,
    },
  };

  useEffect(() => {
    if (loaded && map) {
      addMarker(markerData);
    }
  }, [loaded, map, addMarker]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "calc(100vh - 64px)" }}
    />
  );
};

export default Map;
