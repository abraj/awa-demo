import React from 'react';
import common from '../../styles/common.module.css';
import { Link } from 'react-router-dom';

class PageNotFound extends React.Component {

  render() {
    return (
      <div className={common.container}>
        <div className={common.title}>Page Not Found (404)</div>
        <div className={common.body}>
          <br /><br />
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    )
  }
};

export default PageNotFound;
