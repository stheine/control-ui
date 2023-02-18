/* eslint-disable react/jsx-props-no-multi-spaces */

import Favicon                   from 'react-favicon';
import mqtt                      from 'async-mqtt';
import {Provider}                from 'react-redux';
import {HistoryRouter as Router} from 'redux-first-history/rr6';
import React, {
  useEffect,
  useState,
} from 'react';
import {Route, Routes}           from 'react-router';

import Control                   from '../Control/Control.jsx';
import Dialog                    from '../Dialog/Dialog.jsx';
import faviconBase64             from '../../favicon.js';
import Icons                     from '../Icons/Icons.jsx';
import MqttClientContext         from '../../contexts/MqttClient.js';
import mqttSubscribe             from '../../lib/mqttSubscribe.js';
import Settings                  from '../Settings/Settings.jsx';
import {history, store}          from '../../store/index.js';

const topic = 'control-ui/cmnd/control';

const App = function() {
  const [_message, setMessage] = useState();
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

  useEffect(() => mqttSubscribe({mqttClient: _mqttClient, topic, onMessage: ({message}) => setMessage(message)}),
    [_mqttClient]);

  if(_message) {
    // console.log('App', {_message});
  }

  return (
    <div className='control'>
      <MqttClientContext.Provider value={_mqttClient}>
        <Favicon url={`data:image/png;base64,${faviconBase64}`} />
        <Provider store={store}>
          <Router history={history}>
            <Routes>
              <Route path='/:page'          element={<Control />} />
              <Route path='/icons'          element={<Icons />} />
              <Route path='/settings/:page' element={<Settings />} />
              <Route path='*'               element={<Control page={1} />} />
            </Routes>
          </Router>
        </Provider>
        {_message?.dialog ?
          <Dialog
            key='dialog'
            onClose={() => setMessage()}
          >
            {_message.dialog.map(line => <div key={line}>{line}</div>)}
          </Dialog> :
          null}
      </MqttClientContext.Provider>
    </div>
  );
};

export default App;
