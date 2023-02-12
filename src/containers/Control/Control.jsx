import {connect}            from 'react-redux';
import Favicon              from 'react-favicon';
import mqtt                 from 'async-mqtt';
import {replace}            from 'redux-first-history';
import React, {
  useEffect,
  useState,
} from 'react';

import Down                 from '../../svg/sargam/Down.jsx';
import SettingsVerticalDots from '../../svg/sargam/SettingsVerticalDots.jsx';
import Up                   from '../../svg/sargam/Up.jsx';

import faviconBase64        from '../../favicon.js';
import FitBox               from '../../components/FitBox/FitBox.jsx';
import MqttClientContext    from '../../contexts/MqttClient.js';
import Refresh              from '../../svg/sargam/Refresh.jsx';

import Beep                 from '../../components/Beep/Beep.jsx';
import Button               from '../../components/Button/Button.jsx';
import Display              from '../../components/Display/Display.jsx';
import Fenster              from '../../components/Fenster/Fenster.jsx';
import LedToggle            from '../../components/LedToggle/LedToggle.jsx';
import Solar                from '../../components/Solar/Solar.jsx';
import Temperatur           from '../../components/Temperatur/Temperatur.jsx';
import Vito                 from '../../components/Vito/Vito.jsx';
import Volumio              from '../../components/Volumio/Volumio.jsx';
import Wetter               from '../../components/Wetter/Wetter.jsx';

const maxPages = 4;

const Page1 = function() {
  return [
    <div key='lo' className='control__action'>
      <FitBox>
        <Temperatur site='aussen' />
      </FitBox>
    </div>,
    <div key='mo' className='control__action'>
      <FitBox>
        <Temperatur site='wohnen' />
      </FitBox>
    </div>,
    <div key='ro' className='control__action'>
      <FitBox>
        <Temperatur site='buero' />
      </FitBox>
    </div>,
    <div key='lu' className='control__action'>
      <FitBox>
        <Wetter />
      </FitBox>
    </div>,
    <div key='mu' className='control__action'>
      <FitBox>
        <Solar />
      </FitBox>
    </div>,
    <div key='mr' className='control__action'>
      <FitBox>
        <Fenster />
      </FitBox>
    </div>,
  ];
};

const Page2 = function() {
  return [
    <div key='lo' className='control__action'>
      <FitBox>
        &nbsp;
      </FitBox>
    </div>,
    <div key='mo' className='control__action'>
      <FitBox>
        <Volumio />
      </FitBox>
    </div>,
    <div key='ro' className='control__action'>
      <FitBox>
        &nbsp;
      </FitBox>
    </div>,
    <div key='lu' className='control__action'>
      <FitBox>
        <Vito />
      </FitBox>
    </div>,
    <div key='mu' className='control__action'>
      <FitBox>
        &nbsp;
      </FitBox>
    </div>,
    <div key='mr' className='control__action'>
      <FitBox>
        &nbsp;
      </FitBox>
    </div>,
  ];
};

const reloadPage = function() {
  // eslint-disable-next-line no-undef
  window.location.replace(window.location.pathname);
};

const Page3 = function() {
  return [
    <div key='lo' className='control__action'>
      <FitBox>
        &nbsp;
      </FitBox>
    </div>,
    <div key='mo' className='control__action'>
      <FitBox>
        &nbsp;
      </FitBox>
    </div>,
    <div key='ro' className='control__action'>
      <Refresh dark={true} onClick={() => reloadPage()} />
    </div>,
    <div key='lu' className='control__action'>
      <FitBox>
        &nbsp;
      </FitBox>
    </div>,
    <div key='mu' className='control__action'>
      <FitBox>
        &nbsp;
      </FitBox>
    </div>,
    <div key='mr' className='control__action'>
      <FitBox>
        &nbsp;
      </FitBox>
    </div>,
  ];
};

const Page4 = function() {
  return [
    <div key='lo' className='control__action'>
      <Display />
    </div>,
    <div key='mo' className='control__action'>
      <FitBox>
        <Button type='Upper' />
      </FitBox>
    </div>,
    <div key='ro' className='control__action'>
      <FitBox>
        <LedToggle color='Red' />
      </FitBox>
    </div>,
    <div key='lu' className='control__action'>
      <Beep />
    </div>,
    <div key='mu' className='control__action'>
      <FitBox>
        <Button type='Lower' />
      </FitBox>
    </div>,
    <div key='mr' className='control__action'>
      <FitBox>
        <LedToggle color='White' />
      </FitBox>
    </div>,
  ];
};
const Page = function(props) {
  const {page} = props;

  switch(page) {
    case 1: return <Page1 />;
    case 2: return <Page2 />;
    case 3: return <Page3 />;
    case 4: return <Page4 />;

    default: throw new Error(`Unhandled page='${page}'`);
  }
};

const Control = function(props) {
  const {dispatch, page} = props;

  // console.log('Control', {props, page});

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

  return (
    <MqttClientContext.Provider value={_mqttClient}>
      <div>
        <Favicon url={`data:image/png;base64,${faviconBase64}`} />
        <div className='control' id='control'>
          <div className='control__down'>
            <Page page={page} />
          </div>
          <div className='control__up'>
            <div className='control__navigation'>
              <FitBox>
                <Up dark={true} onClick={() => dispatch(replace(`/${(page - 1) % maxPages || maxPages}`))} />
              </FitBox>
            </div>
            <div className='control__navigation'>
              <FitBox>
                <SettingsVerticalDots dark={true} />
              </FitBox>
            </div>
            <div className='control__navigation'>
              <FitBox>
                <Down dark={true} onClick={() => dispatch(replace(`/${page + 1 || maxPages}`))} />
              </FitBox>
            </div>
          </div>
        </div>
      </div>
    </MqttClientContext.Provider>
  );
};

const mapStateToProps = state => {
  const {settings} = state;

  return {settings};
};

export default connect(mapStateToProps)(Control);
