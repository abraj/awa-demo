import React from 'react';
import { Button } from '@baadal-sdk/baadal-ui';
import styles from './fullscreen.module.css'
import common from '../../styles/common.module.css';
import { Link } from 'react-router-dom';

class FullscreenDemo extends React.Component<FullscreenDemoProps, FullscreenDemoState> {
  state: FullscreenDemoState;
  videoRef: React.RefObject<HTMLVideoElement>;
  headingRef: React.RefObject<HTMLDivElement>;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  timeout: NodeJS.Timeout | null = null;

  constructor(props: FullscreenDemoProps) {
    super(props);

    this.state = { error: false, errorMsg: '', hidePointer: false };

    this.videoRef =  React.createRef<HTMLVideoElement>();
    this.headingRef =  React.createRef<HTMLDivElement>();
    this.iframeRef =  React.createRef<HTMLIFrameElement>();

    document.addEventListener('keypress', (e) => {
      if (e.key.toLocaleLowerCase() === 'Enter'.toLowerCase()) {
        this.exitFullscreen();
      }
    });

    document.addEventListener('mousemove', (e) => {
      this.handleMousemove();
    });
  }

  handleMousemove = () => {
    this.setState({ hidePointer: false });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      if (document.fullscreenElement) {
        this.setState({ hidePointer: true });
      }
    }, 1500);
  };

  enterFullscreen = (ele: HTMLElement) => {
    if (!document.fullscreenEnabled) {
      const errorMsg = 'Add allow="fullscreen" to the iframe';
      this.setState({ error: true, errorMsg });
      setTimeout(() => {
        this.setState({ error: false, errorMsg: '' });
      }, 6000);
      return;   
    }

    // If the document is not in full screen mode, then make the element full screen
    if (!document.fullscreenElement) {
      ele.requestFullscreen();
    }
  };

  exitFullscreen = () => {
    // If the document is in full screen mode, then exit the full screen
    if (document.fullscreenElement) {
      document.exitFullscreen();
      this.setState({ hidePointer: false });
    }
  };

  toggleFullscreen = (ele: HTMLElement) => {
    if (!document.fullscreenElement) {
      this.enterFullscreen(ele);
    } else {
      this.exitFullscreen();
    }
  }

  videoFullscreen = () => {
    if (this.videoRef.current) {
      this.toggleFullscreen(this.videoRef.current);
    }
  };

  headingFullscreen = () => {
    if (this.headingRef.current) {
      this.toggleFullscreen(this.headingRef.current);
    }
  };

  iframeFullscreen = () => {
    if (this.iframeRef.current) {
      this.toggleFullscreen(this.iframeRef.current);
    }
  };

  render() {    
    const { error, errorMsg, hidePointer } = this.state;
    return (
      <div className={common.container}>
        <div className={common.title}>Fullscreen API Demo</div>
        <div className={`${common.body} ${hidePointer ? styles.hidePointer : ''}`}>
          {/* {error && (
            <div className={common.errorMsg}>This browser is not supported!</div>
          )} */}

          {error && (
            <div className={common.errorMsg}>{errorMsg}</div>
          )}

          <br />
          <div>
            <div className={styles.itemsContainer}>
              <div ref={this.headingRef} className={styles.headingContainer}>
                <h1 className={styles.headingText}>This is a <code>Heading</code>.</h1>
              </div>
              <div className={styles.fsButtonContainer}>
                <Button variant="outlined" color="info" onClick={() => this.headingFullscreen()}>Go fullscreen</Button>
              </div>
            </div>
          </div>

          <br />
          <div>
            <div className={styles.itemsContainer}>
              <div>
                <video ref={this.videoRef} src="https://mdn.github.io/dom-examples/fullscreen-api/assets/bigbuckbunny.mp4" id="video" controls width="480"></video>
              </div>
              <div className={styles.fsButtonContainer}>
                <Button variant="outlined" color="info" onClick={() => this.videoFullscreen()}>Go fullscreen</Button>
              </div>
            </div>
          </div>

          <br />
          <div className={styles.itemsContainer}>
            <div>
              <iframe ref={this.iframeRef} src="https://awa-demo.web.app/iframe-page" title="iframe-page" width="480px" height="80px"></iframe>
            </div>
            <div className={styles.fsButtonContainer}>
              <Button variant="outlined" color="info" onClick={() => this.iframeFullscreen()}>Go fullscreen</Button>
            </div>
          </div>

          <br />
          <a href="https://github.com/abraj/awa-demo/tree/main/src/demo/fullscreen">Source code</a>
          <br />
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API">Fullscreen API documentation</a>

          <br /><br />
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    )
  }
};

export default FullscreenDemo;

export interface FullscreenDemoProps {}

export interface FullscreenDemoState {
  error: boolean;
  errorMsg: string;
  hidePointer: boolean;
}
