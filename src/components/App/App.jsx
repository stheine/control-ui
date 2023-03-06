/* eslint-disable object-property-newline */
/* eslint-disable react/jsx-props-no-multi-spaces */

import _                         from 'lodash';
import {connect}                 from 'react-redux';
import Favicon                   from 'react-favicon';
import mqtt                      from 'async-mqtt';
import {replace}                 from 'redux-first-history';
import {HistoryRouter as Router} from 'redux-first-history/rr6';
import React, {
  useEffect,
  useState,
} from 'react';
import {Route, Routes}           from 'react-router';

import Control                   from '../Control/Control.jsx';
import Dialog                    from '../Dialog/Dialog.jsx';
import faviconBase64             from '../../favicon.js';
import {history}                 from '../../store/index.js';
import Icons                     from '../Icons/Icons.jsx';
import MqttClientContext         from '../../contexts/MqttClient.js';
import mqttSubscribe             from '../../lib/mqttSubscribe.js';
import Settings                  from '../Settings/Settings.jsx';

const topics = [
  'control-ui/cmnd/dialog',
  'control-ui/cmnd/route',
];

const App = function(props) {
  const {dispatch} = props;

  const [_messages, setMessages] = useState({});
  const [_mqttClient, setMqttClient] = useState();

  useEffect(() => {
    // / eslint-disable-next-line no-console
    // console.log('Control:useEffect, initial');

    let mqttClient;

    const initMqtt = async function() {
      try {
        mqttClient = await mqtt.connectAsync('tcp://192.168.6.7:9001'); // TODO from settings

        setMqttClient(mqttClient);
      } catch(err) {
        // eslint-disable-next-line no-console
        console.log('Failed to init', err.message);
      }
    };

    initMqtt();

    return async() => {
      await mqttClient.end();

      setMqttClient();
    };
  }, []);

  useEffect(() => mqttSubscribe({mqttClient: _mqttClient, topics, onMessage({topic, message}) {
    switch(topic) {
      case 'control-ui/cmnd/route':
        dispatch(replace(message));
        break;

      default:
        setMessages(prevMessages => ({...prevMessages, [topic]: message}));
        break;
    }
  }}), [_mqttClient, dispatch]);

  if(!_mqttClient) {
    return;
  }

  if(!_.isEmpty(_messages)) {
    // console.log('App', {_messages});
  }

  const dialog = _messages?.['control-ui/cmnd/dialog'] ? [_messages?.['control-ui/cmnd/dialog']].flat() : null;

  return (
    <div className='control'>
      <MqttClientContext.Provider value={_mqttClient}>
        <Favicon url={`data:image/png;base64,${faviconBase64}`} />
        <Router history={history}>
          <Routes>
            <Route path='/'               element={<Control />} />
            <Route path='/:page'          element={<Control />} />
            <Route path='/icons'          element={<Icons />} />
            <Route path='/settings/:page' element={<Settings />} />
            <Route path='*'               element={<Control />} />
          </Routes>
        </Router>
        {dialog ?
          <Dialog
            key='dialog'
            onClose={() => setMessages(prevMessages => _.omit(prevMessages, ['control-ui/cmnd/dialog']))}
          >
            {dialog.map(line => <div key={line}>{_.isObject(line) ? JSON.stringify(line) : line}</div>)}
          </Dialog> :
          null}
      </MqttClientContext.Provider>
    </div>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(App);
