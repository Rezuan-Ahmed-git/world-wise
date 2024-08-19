import { useNavigate } from 'react-router-dom';
import styles from './Map.module.css';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from 'react-leaflet';
// import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import { useEffect, useState } from 'react';
import { useCities } from '../contexts/CitiesContext';
import { useGeolocation } from '../hooks/useGeolocation';
import Button from './Button';
import { useURLPosition } from '../hooks/useURLPosition';

function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geolocationPosition,
    getPosition,
  } = useGeolocation();

  const [mapLat, mapLng] = useURLPosition();

  useEffect(
    function () {
      if (mapLat && mapLng) setMapPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  useEffect(
    function () {
      if (geolocationPosition)
        setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    },
    [geolocationPosition]
  );

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? 'Loading...' : 'Use Your Position'}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>
                {' '}
                <img
                  src={`https://flagcdn.com/32x24/${city?.emoji.toLowerCase()}.png`}
                  alt={city.cityName}
                />{' '}
              </span>{' '}
              <span> {city.cityName} </span>
            </Popup>
          </Marker>
        ))}
        <ChangeCenter position={mapPosition} />
        <DetectClick />
        {/* <SearchLocation provider={new OpenStreetMapProvider()} /> */}
      </MapContainer>
    </div>
  );
}

function ChangeCenter({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
}

//search bar
// const SearchLocation = (props) => {
//   // Get access to leaflet map
//   const { provider } = props;

//   // Get search control
//   const searchControl = new GeoSearchControl({
//     provider: provider,
//   });

//   //   Access Leaflet Map
//   const map = useMap(props);
//   useEffect(() => {
//     // Add searchControl to Leaflet map
//     map.addControl(searchControl);
//     return () => map.removeControl(searchControl);
//   });

//   return null; // Do not render any thing
// };
export default Map;
