// src/app/components/Map.tsx
import React, { useRef } from "react";
import { useMapbox } from "../hooks/useMapbox";

interface MapProps {
  center: [number, number];
  zoom: number;
}

const Map: React.FC<MapProps> = ({ center, zoom }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { map, loaded } = useMapbox(mapContainer, center, zoom);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "calc(100vh - 64px)" }}
    />
  );
};

export default Map;
