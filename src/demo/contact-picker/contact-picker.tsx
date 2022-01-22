import React from 'react';
import { Button } from '@baadal-sdk/baadal-ui';
import styles from './contact-picker.module.css'
import { Link } from 'react-router-dom';

const featureDetect = () => {
  const supported = ('contacts' in navigator && 'ContactsManager' in window);
  return supported ? (navigator as any).contacts : null;
};

const filterSelectedProps = (selectedProps: Map<string, boolean>) => {
    let props = [];
    const entries = Array.from(selectedProps.entries());
    for (const [key, value] of entries) {
      if (value) props.push(key);      
    }
    return props;
};

const removeDuplicates = (arr: string[]) => {
  if (arr.length <= 1) return arr;
  const map_ = new Map<string, string>();
  for (const item of arr) {
    const key = item.replace(/\s/g, '');
    if (!map_.get(key)) {
      map_.set(key, item);
    }
  }
  return Array.from(map_.values());
};

class ContactPickerDemo extends React.Component {
  state: ContactPickerDemoState;

  constructor(props: ContactPickerDemoProps) {
    super(props);
    this.state = {
      contactsManager: null,
      supportedProps: null,
      selectedProps: null,
      error: false,
      contactList: null,
      selectMultiple: false,
      displayRaw: false,
    };
  }

  async componentDidMount() {
    const contactsManager = featureDetect();
    if (contactsManager) {
      let supportedProps: string[] = await contactsManager.getProperties();
      const i1 = supportedProps.indexOf('name');
      if (i1 >= 0) supportedProps.splice(i1, 1);
      const i2 = supportedProps.indexOf('tel');
      if (i2 >= 0) supportedProps.splice(i2, 1);
      supportedProps = ['name', 'tel', ...supportedProps];

      const selectedProps = new Map<string, boolean>();
      supportedProps.map(prop => selectedProps.set(prop, prop === 'name' || prop === 'tel'));
      this.setState({ contactsManager, supportedProps, selectedProps });
    }
  }

  getContacts = async () => {
    const { contactsManager, selectedProps, selectMultiple } = this.state;
    if (!contactsManager || !selectedProps) return;

    const props = filterSelectedProps(selectedProps);
    if (!props.length) return;

    try {
      const opts = { multiple: selectMultiple };
      const contactList = await contactsManager.select(props, opts);
      this.setState({ contactList });
    } catch (e) {
      this.setState({ error: true, contactList: null });
    }
  }

  resetContacts = () => {
    this.setState({ contactList: null });
  }

  getContactsList = () => {
    const { contactList, supportedProps } = this.state;
    if (!contactList || !supportedProps) return null;

    const contactObjList: any[] = [];
    for (const contact of contactList) {
      const contactObj: any = {};
      for (const prop of supportedProps) {
        let item = contact[prop];
        if (!item) continue;
        if (prop === 'tel') {
          item = removeDuplicates(item);
        }
        if (item && !Array.isArray(item)) {
          contactObj[prop] = item;
        } else if (Array.isArray(item) && item.length) {
          contactObj[prop] = item.join(', ');
        }
      }
      if (Object.keys(contactObj).length) {
        contactObjList.push(contactObj);
      }
    }

    return contactObjList;
  }
  
  handleSelectedPropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {selectedProps} = this.state;
    if (!selectedProps) return;

    const id = e.target.id;
    const prop = id.split('-')[2];
    selectedProps.set(prop, e.target.checked);
    
    this.setState({ selectedProps }); // re-render
  };

  handleSelectMultipleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectMultiple = e.target.checked;
    this.setState({ selectMultiple });
  };

  handleDisplayRawChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const displayRaw = e.target.checked;
    this.setState({ displayRaw });
  };

  render() {
    const { contactsManager, supportedProps, selectedProps, error, selectMultiple, displayRaw } = this.state;

    let contactsList = displayRaw ? this.state.contactList : this.getContactsList();
    if (contactsList && Array.isArray(contactsList) && !contactsList.length) {
      contactsList = null;
    }

    const disabled = !selectedProps || !filterSelectedProps(selectedProps).length;

    return (
      <div className={styles.container}>
        <div className={styles.title}>Contact Picker API Demo</div>
        <div className={styles.body}>
          {!contactsManager && (
            <div className={styles.errorMsg}>This browser is not supported!</div>
          )}

          {error && (
            <div className={styles.errorMsg}>Something went wrong! Check permissions.</div>
          )}

          <br />
          {(contactsManager && !error) && (
            <div>
              <div className={styles.btnContainer}>
                <Button variant="solid" color="info" size="lg" raised="lg" onClick={this.getContacts} disabled={disabled}>Select Contacts</Button>
                <div>&nbsp;&nbsp;</div>
                <label>
                  <input
                    name="isSelectMultiple"
                    type="checkbox"
                    checked={selectMultiple}
                    onChange={e => this.handleSelectMultipleChange(e)} />
                  &nbsp; Select multiple
                </label>
              </div>
              <div className={styles.propsContainer}>
                {supportedProps && supportedProps.map(prop => (
                  <div key={prop}>
                    <label>
                      <input
                        id={`prop-id-${prop}`}
                        type="checkbox"
                        checked={!!selectedProps?.get(prop)}
                        onChange={e => this.handleSelectedPropChange(e)} />
                      &nbsp;{prop}
                    </label>
                    <span>&nbsp;</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <br />
          {contactsList && (
            <div className={styles.resultTitle}>
              Results
            </div>
          )}
          {contactsList && contactsList.map((contact, index) => {
            return (
              <div key={index} className={styles.resultItem}>
                {displayRaw ? (
                  <div className={styles.rawResult}>
                    {JSON.stringify(contact)}
                  </div>
                ) : (
                  <table>
                    {Object.entries(contact).map(([key, value]) => (
                      <tr>
                        <td style={{ fontWeight: 'bold' }}>{key[0].toUpperCase() + key.substring(1)}</td>
                        <td>&nbsp;:&nbsp;&nbsp;</td>
                        <td>{value as any}</td>
                      </tr>
                    ))}
                  </table>
                )}
              </div>
            );
          })}
          <br />
          {contactsList && (
            <div className={styles.btnContainer}>
              <Button variant="solid" color="light" onClick={this.resetContacts}>Clear</Button>
              <div>&nbsp;&nbsp;</div>
              <label>
                <input
                  name="isDisplayRaw"
                  type="checkbox"
                  checked={displayRaw}
                  onChange={e => this.handleDisplayRawChange(e)} />
                &nbsp; Display raw
              </label>
            </div>
          )}

          <br />
          <a href="https://github.com/abraj/awa-demo/tree/main/src/demo/contact-picker">Source code</a>
          <br />
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Contact_Picker_API">Contact Picker API documentation</a>

          <br /><br />
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    );
  }
}

export default ContactPickerDemo;

export interface ContactPickerDemoState {
  contactsManager: any;
  supportedProps: string[] | null;
  selectedProps: Map<string, boolean> | null;
  error: boolean;
  contactList: any[] | null;
  selectMultiple: boolean;
  displayRaw: boolean;
}

export interface ContactPickerDemoProps {}
