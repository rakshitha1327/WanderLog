import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import L from "leaflet";

function AutoFitBounds({ trips, places }) {
  const map = useMap();

  useEffect(() => {
    const data = places || trips;
    if (!data || data.length === 0) return;

    const points = data.flatMap((item) => {
      if (item.coordinates) return [item.coordinates]; // places array
      if (item.placesVisited) return item.placesVisited?.map((p) => p.coordinates) || []; // trips array
      return [];
    });

    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
  }, [trips, places, map]);

  return null;
}

export default function MapView({ trips = [], places = [], onMarkerClick }) {
  return (
    <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* AutoFitBounds removed to keep World View static */}
      {/* <AutoFitBounds trips={trips} places={places} /> */}

      {/* Handle places array */}
      {places.map((place, idx) => (
        <Marker
          key={`place-${idx}`}
          position={place.coordinates}
          eventHandlers={{
            click: () => onMarkerClick?.(place.tripId),
          }}
        >
          <Popup>
            {place.tripTitle ? (
              <>
                <strong>{place.tripTitle}</strong>
                <br />
                📍 {place.name}
              </>
            ) : (
              <>📍 {place.name}</>
            )}
          </Popup>
        </Marker>
      ))}

      {/* Handle trips array */}
      {trips.map((trip) =>
        trip.placesVisited?.map((place, idx) => (
          <Marker
            key={`${trip._id}-${idx}`}
            position={place.coordinates}
            eventHandlers={{
              click: () => onMarkerClick?.(trip._id),
            }}
          >
            <Popup>
              <strong>{trip.title}</strong>
              <br />
              📍 {place.name}
            </Popup>
          </Marker>
        ))
      )}
    </MapContainer>
  );
}
