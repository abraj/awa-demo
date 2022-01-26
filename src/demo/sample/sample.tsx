import React from 'react';
// import styles from './geolocation.module.css'
import common from '../../styles/common.module.css';
import { Link } from 'react-router-dom';

class GeoLocationDemo extends React.Component<GeoLocationDemoProps, GeoLocationDemoState> {
  state: GeoLocationDemoState;

  constructor(props: GeoLocationDemoProps) {
    super(props);
    this.state = { error: false };
  }

  render() {
    const { error } = this.state;
    return (
      <div className={common.container}>
        <div className={common.title}>Geolocation API Demo</div>
        <div className={common.body}>
          {error && (
            <div className={common.errorMsg}>This browser is not supported!</div>
          )}

          {error && (
            <div className={common.errorMsg}>Something went wrong! Check permissions.</div>
          )}

          <br />
          {/* <div>Demo</div> */}

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
  error: boolean;
}
