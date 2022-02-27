import React from 'react';
import { Button } from '@baadal-sdk/baadal-ui';
import styles from './clipboard.module.css'
import common from '../../styles/common.module.css';
import { Link } from 'react-router-dom';

const featureDetect = () => {
  const supported = 'clipboard' in navigator;
  return supported;
};

class ClipboardDemo extends React.Component<ClipboardDemoProps, ClipboardDemoState> {
  state: ClipboardDemoState;

  constructor(props: ClipboardDemoProps) {
    super(props);
    this.state = {
      error: false,
      errorMsg: '',
      clipboardMessage: '',
      clipboardText: 'Hi there!',
      clipboardTextView: '',
    };
  }

  componentDidMount() {
    const xx = featureDetect();
    console.log('>>', xx);    
  }

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ clipboardText: e.target.value || ''});
  };

  writeToClipboard = async () => {
    try {
      const text = this.state.clipboardText;
      await navigator.clipboard.writeText(text);
      this.setState({ clipboardMessage: 'Copied!'});
      setTimeout(() => {
        this.setState({ clipboardMessage: ''});
      }, 2500);
    } catch (err) {
      this.setState({ error: true, errorMsg: 'Failed to write to clipboard!' });
      setTimeout(() => {
        this.setState({ error: false, errorMsg: '' });
      }, 6000);
      console.log(err);
    }
  };

  readFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      this.setState({ clipboardTextView: text });
      setTimeout(() => {
        this.setState({ clipboardTextView: '' });
      }, 5000);
      return text;
    } catch (err) {
      this.setState({ error: true, errorMsg: 'Failed to read from clipboard!' });
      setTimeout(() => {
        this.setState({ error: false, errorMsg: '' });
      }, 6000);
      console.log(err);
    }
    return '';
  };

  render() {
    const { error, errorMsg, clipboardMessage, clipboardText, clipboardTextView } = this.state;
    return (
      <div className={common.container}>
        <div className={common.title}>Clipboard API Demo</div>
        <div className={common.body}>
          {/* {error && (
            <div className={common.errorMsg}>This browser is not supported!</div>
          )} */}

          {error && (
            <div className={common.errorMsg}>{errorMsg}</div>
          )}

          <br />
          <div className={styles.clipboardContainer}>
            <input type="text" value={clipboardText} className={styles.clipboardText} onChange={(e) => this.onInputChange(e)} />
            <Button color="info" onClick={() => this.writeToClipboard()}>Copy to clipboard</Button>
            {clipboardMessage && (
              <div className={styles.clipboardMessage}>{clipboardMessage}</div>
            )}
          </div>

          <br />
          <div className={styles.clipboardContainer}>
            <Button color="info" onClick={() => this.readFromClipboard()}>View clipboard</Button>
            {clipboardTextView && (
              <div className={styles.clipboardMessage}>{clipboardTextView}</div>
            )}
          </div>

          <br />
          <br />
          <br />
          <a href="https://github.com/abraj/awa-demo/tree/main/src/demo/clipboard">Source code</a>
          <br />
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API">Clipboard API documentation</a>

          <br /><br />
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    )
  }
};

export default ClipboardDemo;

export interface ClipboardDemoProps {}

export interface ClipboardDemoState {
  error: boolean;
  errorMsg: string;
  clipboardMessage: string;
  clipboardText: string;
  clipboardTextView: string;
}
