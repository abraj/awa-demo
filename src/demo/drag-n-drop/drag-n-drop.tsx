import React from 'react';
// import styles from './drag-n-drop.module.css'
import common from '../../styles/common.module.css';
import { Link } from 'react-router-dom';

class DragDropDemo extends React.Component<DragDropDemoProps, DragDropDemoState> {
  state: DragDropDemoState;

  constructor(props: DragDropDemoProps) {
    super(props);
    this.state = { error: false };
  }

  render() {
    const { error } = this.state;
    return (
      <div className={common.container}>
        <div className={common.title}>Drag and Drop API Demo</div>
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
          <a href="https://github.com/abraj/awa-demo/tree/main/src/demo/drag-n-drop">Source code</a>
          <br />
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API">Drag and Drop API documentation</a>

          <br /><br />
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    )
  }
};

export default DragDropDemo;

export interface DragDropDemoProps {}

export interface DragDropDemoState {
  error: boolean;
}
