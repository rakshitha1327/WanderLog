import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Custom marker icon (optional fix for missing default icon)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Simple geocoding function (using OpenStreetMap Nominatim)
async function geocodeLocation(location) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        name: location,
      };
    }
  } catch (error) {
    console.error("Geocoding error:", error);
  }
  return null;
}

export default function MapView({ trips = [], place = null, places = [] }) {
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState([20.5937, 78.9629]); // India center
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    const loadMarkers = async () => {
      const positions = [];

      // If trips array provided (Explore, Reviews pages)
      if (trips && trips.length > 0) {
        for (const trip of trips) {
          if (trip.location) {
            const geo = await geocodeLocation(trip.location);
            if (geo) {
              positions.push({
                id: trip.id || Math.random(),
                name: trip.title || trip.location,
                lat: geo.lat,
                lng: geo.lng,
                location: trip.location,
              });
            }
          }
        }
        if (positions.length > 0) {
          setCenter([positions[0].lat, positions[0].lng]);
          setZoom(positions.length === 1 ? 6 : 3);
        }
      }
      // If place and places array provided (TripDetails page)
      else if (place) {
        const geo = await geocodeLocation(place);
        if (geo) {
          positions.push({
            id: "main",
            name: place,
            lat: geo.lat,
            lng: geo.lng,
          });
          setCenter([geo.lat, geo.lng]);
          setZoom(6);

          // Add markers for places visited
          if (places && places.length > 0) {
            for (const p of places) {
              const placeName = typeof p === "string" ? p : p.name || p;
              if (placeName && placeName !== place) {
                const placeGeo = await geocodeLocation(placeName);
                if (placeGeo) {
                  positions.push({
                    id: `place-${placeName}`,
                    name: placeName,
                    lat: placeGeo.lat,
                    lng: placeGeo.lng,
                  });
                }
              }
            }
          }
        }
      }

      setMarkers(positions);
    };

    loadMarkers();
  }, [trips, place, places]);

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.lat, marker.lng]}>
            <Popup>{marker.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
