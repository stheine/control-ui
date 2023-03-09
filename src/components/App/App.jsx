/* eslint-disable object-property-newline */
/* eslint-disable react/jsx-props-no-multi-spaces */

import _                         from 'lodash';
import {connect}                 from 'react-redux';
import Favicon                   from 'react-favicon';
import mqtt                      from 'async-mqtt';
import {replace}                 from 'redux-first-history';
import {HistoryRouter as Router} from 'redux-first-history/rr6';
import {v4 as uuidv4}            from 'uuid';
import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Route, Routes}           from 'react-router';

import AppContext                from '../../contexts/AppContext.js';
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

  const appContextValue = useMemo(() => ({clientId: uuidv4()}), []);

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
        if(message?.clientId === appContextValue.clientId) {
          setMessages(prevMessages => ({...prevMessages, [topic]: message}));
        }
        break;
    }
  }}), [appContextValue, _mqttClient, dispatch]);

  if(!_mqttClient) {
    return;
  }

  if(!_.isEmpty(_messages)) {
    // console.log('App', {_messages});
  }

  let dialogData;
  let dialogHeader;

  if(_messages?.['control-ui/cmnd/dialog']) {
    dialogHeader = _messages?.['control-ui/cmnd/dialog']?.header;
    dialogData   = _messages?.['control-ui/cmnd/dialog']?.data?.map(line =>
      <div key={line}>{_.isObject(line) ? JSON.stringify(line) : line}</div>);
  }

  return (
    <div className='control'>
      <AppContext.Provider value={appContextValue}>
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
          {dialogData ?
            <Dialog
              key='dialog'
              onClose={() => setMessages(prevMessages => _.omit(prevMessages, ['control-ui/cmnd/dialog']))}
              header={dialogHeader}
              data={dialogData}
            /> :
            null}
        </MqttClientContext.Provider>
      </AppContext.Provider>
    </div>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(App);
