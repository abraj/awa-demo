import React, { useEffect, useState, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { createCustomEqual } from 'fast-equals';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import styles from './google-map.module.css';

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const GoogleMap: React.FC<GoogleMapProps> = ({ apiKey, initialCenter, zoom: initialZoom, style }) => {
  initialCenter = initialCenter || { lat: 0, lng: 0 };
  initialZoom = initialZoom || 5;
  style = style || {};

  const [clicks, setClicks] = useState<google.maps.LatLng[]>([]);
  const [zoom, setZoom] = useState(initialZoom);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(initialCenter);

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    setClicks([...clicks, e.latLng!]);
  };

  const onIdle = (m: google.maps.Map) => {
    // console.log('onIdle');
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  // <label htmlFor="lat">Latitude</label>
  // <input
  //   type="number"
  //   id="lat"
  //   name="lat"
  //   value={center.lat}
  //   onChange={(event) =>
  //     setCenter({ ...center, lat: Number(event.target.value) })
  //   }
  // />

  return (
    <div className={styles.mapContainer} style={style}>
      <div style={{ display: "flex", height: "100%" }}>
        <Wrapper apiKey={apiKey} render={render}>
          <Map
            center={center}
            zoom={zoom}
            onClick={onClick}
            onIdle={onIdle}
            style={{ flexGrow: "1", height: "100%" }}
          >
            <Marker position={center} />
            {/* {clicks.map((latLng, i) => (
              <Marker key={i} position={latLng} />
            ))} */}
          </Map>
        </Wrapper>
      </div>
    </div>
  );
};

export default GoogleMap;

export interface GoogleMapProps {
  apiKey: string;
  initialCenter?: { lat: number, lng: number };
  zoom?: number;
  style?: { [key: string]: string };
}

/*********************************/

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  // Since React does not do deep comparisons, a custom hook is used
  // Ref: https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener('click', onClick);
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} style={style} />

      {/* pass the google.maps.Map object to all children as an additional prop */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  // The component returns null as google.maps.Map manages the DOM manipulation.
  return null;
};

/*********************************/

const deepCompareEqualsForMaps = createCustomEqual(
  (deepEqual) => (a: any, b: any) => {
    if (
      isLatLngLiteral(a) ||
      a instanceof google.maps.LatLng ||
      isLatLngLiteral(b) ||
      b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    // TODO extend to other types

    // use fast-equals for other objects
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value: any) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  useEffect(callback, [...dependencies.map(useDeepCompareMemoize), callback]);
}

/*********************************/

// Ref:
// https://developers.google.com/maps/documentation/javascript/adding-a-google-map
// https://developers.google.com/maps/documentation/javascript/react-map
// https://codesandbox.io/embed/github/googlemaps/js-samples/tree/sample-react-map
