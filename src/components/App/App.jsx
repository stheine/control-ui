/* eslint-disable arrow-body-style */
/* eslint-disable react/no-array-index-key */

import _                         from 'lodash';
import {connect}                 from 'react-redux';
import Favicon                   from 'react-favicon';
import mqtt                      from 'mqtt';
import ms                        from 'ms';
import {v4 as uuidv4}            from 'uuid';
import {
  HashRouter,
  Route,
  Routes,
  // useNavigate,
} from 'react-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import AppContext                from '../../contexts/AppContext.js';
import Control                   from '../Control/Control.jsx';
import Dialog                    from '../Dialog/Dialog.jsx';
import faviconBase64             from '../../favicon.js';
import Icons                     from '../Icons/Icons.jsx';
import Infrarotheizung           from '../Infrarotheizung/Infrarotheizung.jsx';
import Light                     from '../Light/Light.jsx';
import mqttConfigs               from '../mqttConfigs.js';
import MqttContext               from '../../contexts/MqttContext.js';
import Settings                  from '../Settings/Settings.jsx';
import {
  mqttOnMessage,
  mqttSubscribe,
} from '../../lib/mqttSubscribe.js';

const Standalone = function(props) {
  const {site} = props;

  return [
    <meta key='meta' name='viewport' content='width=device-width, initial-scale=1.0, user-scalable=no' />,
    <title key='title'>{site}</title>,
    <Infrarotheizung
      key='inhalt'
      site={site}
      style={{
        fontSize: '10vw',
        position: 'absolute',
        left:     '50px',
        right:    '50px',
        top:    '50px',
      }}
    />,
  ];
};

const App = function() {
  // const navigate = useNavigate();

  const [_dialogContent, setDialogContent] = useState();
  const [_dialogHeader, setDialogHeader] = useState();
  const [_dialogTimeout, setDialogTimeout] = useState();
  const [_messages, setMessages] = useState({});
  const [_mqttClient, setMqttClient] = useState();

  const openDialog = useCallback(({content, header, timeout = '15s'}) => {
    setDialogContent(content);
    setDialogHeader(header);
    if(_dialogTimeout) {
      clearTimeout(_dialogTimeout);
    }
    setDialogTimeout(setTimeout(() => {
      setDialogTimeout();
      setDialogHeader();
      setDialogContent();
    }, ms(timeout)));
  }, [_dialogTimeout]);

  const appContextValue = useMemo(() => ({
    clientId:      uuidv4(),
    controlClient: window.screen.height === 600,
    setAppDialog:  openDialog,
  }), [openDialog]);
  const mqttContextValue = useMemo(() => ({messages: _messages, mqttClient: _mqttClient}), [_messages, _mqttClient]);

  useEffect(() => {
    // / eslint-disable-next-line no-console
    // console.log('App:useEffect, initial');

    let mqttClient;

    const initMqtt = async function() {
      try {
        mqttClient = await mqtt.connectAsync('tcp://192.168.6.5:9001',
          {clientId: `control-ui-${Math.random().toString(16).slice(2, 8)}`}); // TODO from settings

        setMqttClient(mqttClient);
      } catch(err) {
        // eslint-disable-next-line no-console
        console.log('Failed to init', err.message);
      }
    };

    initMqtt();

    return async() => {
      if(mqttClient) {
        await mqttClient.endAsync();

        setMqttClient();
      }
    };
  }, []);

  const onMessage = useCallback(({topic, message}) => {
    // console.log('App:onMessage', {topic, message});

    switch(topic) {
      case 'control-ui/cmnd/dialog':
        if(!message?.clientId || message?.clientId === appContextValue.clientId) {
          openDialog({
            content: message?.data?.map((line, key) =>
              <div key={`${key}-${line}`}>{_.isObject(line) ? JSON.stringify(line) : line}</div>),
            header: message?.header,
          });
        }
        break;

      default:
        setMessages(prevMessages => ({...prevMessages, [topic]: message}));
        break;
    }
  }, [appContextValue.clientId, openDialog]);

  useEffect(() => {
    // / eslint-disable-next-line no-console
    // console.log('App:useEffect, _mqttClient');

    return mqttSubscribe({
      mqttClient: _mqttClient,
      topics:     _.map(mqttConfigs, 'topic'),
    });
  }, [_mqttClient]);
  useEffect(() => {
    // / eslint-disable-next-line no-console
    // console.log('App:useEffect, onMessage');

    mqttOnMessage(onMessage);
  }, [onMessage]);

  if(!_mqttClient) {
    return;
  }

  if(!_.isEmpty(_messages)) {
    // console.log('App', {_messages});
  }

  return (
    <div>
      <AppContext value={appContextValue}>
        <MqttContext value={mqttContextValue}>
          <Favicon url={`data:image/png;base64,${faviconBase64}`} />
          <HashRouter>
            <Routes>
              <Route path='/'                    element={<Control />} />
              <Route path='/:page'               element={<Control />} />
              <Route path='/icons'               element={<Icons />} />
              <Route path='/heizungBuero'        element={<Standalone site='Büro' />} />,
              <Route path='/heizungSchlafzimmer' element={<Standalone site='Schlafzimmer' />} />,
              <Route path='/light/:page'         element={<Light />} />
              <Route path='/settings/:page'      element={<Settings />} />
              <Route path='*'                    element={<Control />} />
            </Routes>
          </HashRouter>
          {_dialogContent ?
            <Dialog
              key='dialog'
              onClose={() => {
                clearInterval(_dialogTimeout);
                setDialogTimeout();
                setDialogHeader();
                setDialogContent();
              }}
              header={_dialogHeader}
              content={_dialogContent}
            /> :
            null}
        </MqttContext>
      </AppContext>
    </div>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(App);
