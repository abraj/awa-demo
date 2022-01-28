import React from 'react';
import dateFormat from 'dateformat';
import { Button } from '@baadal-sdk/baadal-ui';
import styles from './geolocation.module.css'
import common from '../../styles/common.module.css';
import { Link } from 'react-router-dom';
import GoogleMap from '../google-map/google-map';

const featureDetect = () => {
  const supported = ('geolocation' in navigator);
  return supported ? (navigator as any).geolocation : null;
};

class GeoLocationDemo extends React.Component<GeoLocationDemoProps, GeoLocationDemoState> {
  state: GeoLocationDemoState;

  constructor(props: GeoLocationDemoProps) {
    super(props);
    this.state = {
      geolocation: null,
      fetchingLocation: false,
      locationTrackingId: null,
      latitude: null,
      longitude: null,
      locationAccuracy: null,
      locationTimestamp: null,
      error: false,
      errorMsg: '',
    };
  }

  componentDidMount() {
    const geolocation: Geolocation | null = featureDetect();
    if (geolocation) {
      this.setState({ geolocation });
    }
  }

  getErrorMessage = (msg?: string, code?: number) => {
    const defaultMsg = 'Something went wrong! Check permissions.';
    let errorMsg = '';

    if (msg) {
      errorMsg = msg;
    }
    if (code) {
      let codeMsg = '';
      if (code === 1) {
        codeMsg = 'PERMISSION_DENIED';
      } else if (code === 2) {
        codeMsg = 'POSITION_UNAVAILABLE';
      } else if (code === 3) {
        codeMsg = 'TIMEOUT';
      }
      if (codeMsg && !errorMsg) errorMsg = codeMsg;
    }

    if (errorMsg) {
      errorMsg = `Error! ${errorMsg}.`;
    } else {
      errorMsg = defaultMsg;
    }

    return errorMsg;
  };

  resetLocationInfo = (attr?: any) => {
    const additional = attr || {};
    this.setState({
      error: false,
      locationTrackingId: null,
      latitude: null,
      longitude: null,
      locationAccuracy: null,
      locationTimestamp: null,
      ...additional,
    });
  }

  getCurrentPosition = () => {
    const { geolocation } = this.state;
    if (!geolocation) return;

    this.resetLocationInfo();
    this.setState({ fetchingLocation: true });

    const successCallback: PositionCallback = (geolocationPosition) => {
      const { coords, timestamp } = geolocationPosition;
      if (coords) {
        const { latitude, longitude, accuracy } = coords;
        this.setState({ latitude, longitude, locationAccuracy: accuracy, locationTimestamp: timestamp });
      } else {
        const errorMsg = this.getErrorMessage();
        this.setState({ error: true, errorMsg });
      }
      this.setState({ fetchingLocation: false });
    };

    const errorCallback: PositionErrorCallback = (geolocationPositionError) => {
      const { code, message } = geolocationPositionError;
      const errorMsg = this.getErrorMessage(message, code);
      this.setState({ fetchingLocation: false, error: true, errorMsg });
    };

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0
    };

    geolocation.getCurrentPosition(successCallback, errorCallback, options);
  }

  getLivePosition = () => {
    const { geolocation } = this.state;
    if (!geolocation) return;

    this.resetLocationInfo();
    this.setState({ fetchingLocation: true });

    const successCallback: PositionCallback = (geolocationPosition) => {
      const { coords, timestamp } = geolocationPosition;
      if (coords) {
        const { latitude, longitude, accuracy } = coords;
        this.setState({ latitude, longitude, locationAccuracy: accuracy, locationTimestamp: timestamp });
      } else {
        const errorMsg = this.getErrorMessage();
        this.setState({ error: true, errorMsg });
      }
      this.setState({ fetchingLocation: false });
    };

    const errorCallback: PositionErrorCallback = (geolocationPositionError) => {
      const { code, message } = geolocationPositionError;
      const errorMsg = this.getErrorMessage(message, code);
      this.setState({ fetchingLocation: false });
      this.cancelLivePosition({ error: true, errorMsg });
    };

    const options: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 8000,
      maximumAge: 0
    };

    const locationTrackingId = geolocation.watchPosition(successCallback, errorCallback, options);
    this.setState({ locationTrackingId });
  };

  cancelLivePosition = (attr?: any) => {
    const { geolocation, locationTrackingId } = this.state;
    if (!geolocation) return;

    this.resetLocationInfo(attr);

    if (locationTrackingId) {      
      geolocation.clearWatch(locationTrackingId);
    }
  };

  render() {
    const { geolocation, fetchingLocation, locationTrackingId, latitude, longitude, locationAccuracy, locationTimestamp, error, errorMsg } = this.state;

    const disabled = fetchingLocation;
    const accuracy = locationAccuracy ? `${Math.round(locationAccuracy * 10) / 10}` : '';
    const timestamp = locationTimestamp ? dateFormat(new Date(locationTimestamp), 'h:MM:ss TT, mmm d') : '';

    return (
      <div className={common.container}>
        <div className={common.title}>Geolocation API Demo</div>
        <div className={common.body}>
          {!geolocation && (
            <div className={common.errorMsg}>This browser is not supported!</div>
          )}

          {error && (
            <div className={common.errorMsg}>{errorMsg}</div>
          )}

          <br />
          {geolocation && (
            <div>
              {locationTrackingId ? (
                <div>
                  <Button key="cancelLivePosition" variant="solid" color="error" size="lg" raised="lg" onClick={this.cancelLivePosition} disabled={disabled}>Stop Live Tracking</Button>
                </div>
              ) : (
                <div className={styles.btnContainer}>
                  <Button key="getCurrentPosition" variant="solid" color="info" size="lg" raised="lg" onClick={this.getCurrentPosition} disabled={disabled}>Current Location</Button>
                  <Button key="getLivePosition" variant="solid" color="info" size="lg" raised="lg" onClick={this.getLivePosition} disabled={disabled}>Real-time Location</Button>
                </div>
              )}
            </div>
          )}

          <br />
          {(fetchingLocation || (latitude && longitude)) && (
            <div className={styles.locationContainer}>
              {fetchingLocation ? (
                <div className={styles.loaderText}>Loading..</div>
              ) : (
                <div>
                  <div className={styles.mapTitle}>
                    {locationTrackingId ? 'Real-time Location:' : 'Current Location:'}
                  </div>
                  <div className={styles.mapContainer}>
                    {(latitude && longitude) && (
                      <GoogleMap
                        apiKey={`${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`}
                        initialCenter={{ lat: latitude, lng: longitude }}
                        zoom={14}
                      />
                    )}
                    <div className={styles.mapPadding} />
                    <div><span style={{ fontWeight: 'bold' }}>Coordinates:</span> {latitude}°, {longitude}°</div>
                  </div>
                  <div className={styles.locationInfo}>
                    <div>Accurate up to {accuracy} m</div>
                    <div>&nbsp;</div>
                    <div>(Updated on {timestamp})</div>
                  </div>
                </div>
              )}
            </div>
          )}

          <br />
          <a href="https://github.com/abraj/awa-demo/tree/main/src/demo/geolocation">Source code</a>
          <br />
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API">Geolocation API documentation</a>

          <br /><br />
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    )
  }
};

export default GeoLocationDemo;

export interface GeoLocationDemoProps {}

export interface GeoLocationDemoState {
  geolocation: Geolocation | null;
  fetchingLocation: boolean;
  locationTrackingId: number | null,
  latitude: number | null,
  longitude: number | null,
  locationAccuracy: number | null,
  locationTimestamp: number | null,
  error: boolean;
  errorMsg: string;
}
