import React from 'react';
import short from 'short-uuid';
import { Button } from '@baadal-sdk/baadal-ui';
import styles from './notifications.module.css'
import common from '../../styles/common.module.css';
import { Link } from 'react-router-dom';

class NotificationsDemo extends React.Component<NotificationsDemoProps, NotificationsDemoState> {
  state: NotificationsDemoState;

  constructor(props: NotificationsDemoProps) {
    super(props);

    this.state = {
      errorSupport: false,
      error: false,
      permission: '',
      notification: null,
      notifTitle: '',
      notifBody: '',
      notifIcon: 'https://w7.pngwing.com/pngs/235/872/png-transparent-react-computer-icons-redux-javascript-others-logo-symmetry-nodejs-thumbnail.png',
      notifData: { foo: 'bar' },
      notifTag: '',
      notifUserAction: '',
    };
  }

  componentDidMount() {
    if (!('Notification' in window)) {
      this.setState({ errorSupport: true });
    } else {
      this.setState({ permission: Notification.permission });
    }
  }

  requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      this.setState({ permission });
    } catch(err) {
      console.error(err);
    }
  };

  handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    this.setState({ notifTitle: title });
  };

  handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const body = e.target.value;
    this.setState({ notifBody: body });
  };

  handleNotifShow = () => {}

  handleNotifClick = () => {
    this.setState({ notifUserAction: 'Clicked' });
    this.state.notification?.close();
  }

  handleNotifClose = () => {    
    this.setState(state => {
      if (state.notifUserAction !== 'Clicked') {
        return { notifUserAction: 'Closed' };
      }
      return null;
    });
  }

  createNotification = () => {
    // Ref: https://developer.mozilla.org/en-US/docs/Web/API/Notification/Notification
    // Ref: https://developer.mozilla.org/en-US/docs/Web/API/notification

    let { notifTitle, notifBody, notifIcon, notifData } = this.state;

    notifTitle = notifTitle || 'Hello there!';
    notifBody = notifBody || 'This is notification demo';  

    const tag = short.uuid();

    // More options:
    //  * image
    //  * requireInteraction
    //  * actions

    const notification = new Notification(notifTitle, { body: notifBody, tag, icon: notifIcon, data: notifData });
    notification.onshow = this.handleNotifShow;
    notification.onclick = this.handleNotifClick;
    notification.onclose = this.handleNotifClose;
    this.setState({ notification: notification, notifTag: tag, notifUserAction: ''  });

    // console.log('Data:', notification.data);
  };

  render() {
    const { errorSupport, error, permission, notifTitle, notifBody, notifIcon, notifData, notifTag, notifUserAction } = this.state;
    return (
      <div className={common.container}>
        <div className={common.title}>Notifications API Demo</div>
        <div className={common.body}>
          {errorSupport && (
            <div className={common.errorMsg}>This browser does not support notifications!</div>
          )}

          {error && (
            <div className={common.errorMsg}>Something went wrong! Check permissions.</div>
          )}

          <br />
          {!errorSupport && (
            <>
            <div>
              <div>
                <span>Notification permission:&nbsp;</span>
                <span className={styles[`status_${permission}`]}>{permission}</span>
              </div>
              <div style={{ height: '.2rem' }}>&nbsp;</div>
              <div>
                {(permission === 'default') && (
                  <Button variant="solid" color="warn" raised="md" onClick={this.requestPermission}>Allow Notification</Button>
                )}
                {(permission === 'denied') && (
                  <span style={{ color: 'orangered', fontSize: '110%' }}>Please allow Notification permission.</span>
                )}
              </div>
            </div>
            <div style={{ height: '1.5rem' }}>&nbsp;</div>
            <div>
              {permission === 'granted' && (
                <div className={styles.newNotifForm}>
                  <div>
                    <span>Title:&nbsp;&nbsp;</span>
                    <input type="text" style={{ border: '1px solid gainsboro', width: 'fit-content' }} value={notifTitle} onChange={this.handleTitleChange} placeholder="Hello there!" />
                  </div>
                  <div>
                    <span>Body:&nbsp;&nbsp;</span>
                    <input type="text" style={{ border: '1px solid gainsboro', width: 'fit-content' }} value={notifBody} onChange={this.handleBodyChange} placeholder="This is notification demo" />
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span>Icon:&nbsp;&nbsp;</span>
                    <div style={{ fontSize: '90%' }}>{notifIcon}</div>
                  </div>
                  <div style={{ display: 'flex' }}>
                    <span>Data:&nbsp;&nbsp;</span>
                    <div style={{ fontFamily: 'monospace', fontSize: '110%' }}>{JSON.stringify(notifData)}</div>
                  </div>
                  <Button style={{ width: 'fit-content' }} variant="solid" color="info" raised="md" onClick={this.createNotification}>Create New Notification</Button>

                  <div>
                    {notifTag && (
                      <div style={{ display: 'flex' }}>
                        <span>Notification Id:&nbsp;&nbsp;</span>
                        <div style={{ color: 'tomato' }}>{notifTag}</div>
                      </div>
                    )}
                    {notifUserAction && (
                      <div style={{ display: 'flex' }}>
                        <span>Notification Action:&nbsp;&nbsp;</span>
                        <div style={{ color: 'tomato' }}>{notifUserAction}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            </>
          )}

          <br />
          <a href="https://github.com/abraj/awa-demo/tree/main/src/demo/notifications">Source code</a>
          <br />
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API">Notifications API documentation</a>

          <br /><br />
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    )
  }
};

export default NotificationsDemo;

export interface NotificationsDemoProps {}

export interface NotificationsDemoState {
  errorSupport: boolean;
  error: boolean;
  permission: 'default' | 'granted' | 'denied' | '';
  notification: Notification | null;
  notifTitle: string;
  notifBody: string;
  notifIcon: string;
  notifTag: string;
  notifData: {[key: string]: any};
  notifUserAction: string;
}
