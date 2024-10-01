import { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOMServer from "react-dom/server";
import PopupContent from "../components/PopupContent";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const michiganBounds = [
  [-95.4, 38.7],
  [-73.4, 49.3],
];

const markerIcon = { src: "/mapIcon.svg" };
const customStyleUrl = "mapbox://styles/jamesnoh123/cm0p46kww02ku01qrgqgh8erx";

interface MarkerData {
  latitude: number;
  longitude: number;
  name: string;
  temperature: number;
}

export const useMapbox = (
  container: React.RefObject<HTMLDivElement>,
  center: [number, number],
  initialZoom: number,
  initialPitch: number = 25
) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (mapRef.current || !container.current) return;

    mapRef.current = new mapboxgl.Map({
      container: container.current,
      style: customStyleUrl,
      center: center,
      zoom: initialZoom,
      pitch: initialPitch,
      maxBounds: michiganBounds,
    });

    mapRef.current.on("load", () => {
      if (!mapRef.current) return;
      setLoaded(true);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [container, center, initialZoom, initialPitch]);

  const addMarker = (markers: Record<string, MarkerData>) => {
    if (!mapRef.current) return;

    Object.entries(markers).forEach(([key, data]) => {
      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "30px";
      el.style.height = "30px";

      const img = document.createElement("img");
      img.src = markerIcon.src;
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "contain";
      img.onerror = () => {
        console.error("Error loading marker image");
        el.style.backgroundColor = "red";
      };
      el.appendChild(img);

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([data.longitude, data.latitude])
        .addTo(mapRef.current!);

      let popup: mapboxgl.Popup | null = null;

      el.addEventListener("mouseenter", () => {
        const popupContent = ReactDOMServer.renderToString(
          <PopupContent name={data.name} temperature={data.temperature} />
        );

        popup = new mapboxgl.Popup({
          offset: 30,
          closeButton: false,
          closeOnClick: false,
          className: "custom-popup",
        })
          .setLngLat([data.longitude, data.latitude])
          .setHTML(popupContent)
          .addTo(mapRef.current!);
      });

      el.addEventListener("mouseleave", () => {
        if (popup) {
          popup.remove();
          popup = null;
        }
      });
    });
  };

  return { map: mapRef.current, loaded, addMarker };
};
