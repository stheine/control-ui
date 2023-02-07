import {connect}         from 'react-redux';
import Favicon           from 'react-favicon';
import mqtt              from 'async-mqtt';
import React, {
  useEffect,
  useState,
} from 'react';

import Left                 from '../../svg/sargam/Left.jsx';
import Play                 from '../../svg/sargam/Play.jsx';
import Right                from '../../svg/sargam/Right.jsx';
import SettingsVerticalDots from '../../svg/sargam/SettingsVerticalDots.jsx';

import faviconBase64     from '../../favicon.js';
import FitBox            from '../../components/FitBox.jsx';
import MqttClientContext from '../../contexts/MqttClient.js';

import Fenster           from '../../components/Fenster/Fenster.jsx';
import Solar             from '../../components/Solar/Solar.jsx';
import Temperaturen      from '../../components/Temperaturen/Temperaturen.jsx';
import Volumio           from '../../components/Volumio/Volumio.jsx';

const Control = function(/* props */) {
//  console.log('Control', {props});

  const [_mqttClient, setMqttClient] = useState();

  useEffect(() => {
    // TODO
    // eslint-disable-next-line no-console
    console.log('Control:useEffect, initial');

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

//  useEffect(() => {
//    console.log('Control:useEffect, all');
//  });

  return (
    <MqttClientContext.Provider value={_mqttClient}>
      <div>
        <Favicon url={`data:image/png;base64,${faviconBase64}`} />
        <div className='control' id='control'>
          <div className='control__left'>
            <div className='control__action'>
              <FitBox>
                tadadada
              </FitBox>
            </div>
            <div className='control__action'>
              <FitBox>
                The quick brown fox jumps over the lazy dog
              </FitBox>
            </div>
            <div className='control__action'>
              <FitBox>
                <Volumio />
              </FitBox>
            </div>
            <div className='control__action'>
              <FitBox>
                <Fenster />
              </FitBox>
            </div>
            <div className='control__action'>
              <FitBox>
                <Solar />
              </FitBox>
            </div>
            <div className='control__action'>
              <FitBox>
                <Temperaturen />
              </FitBox>
            </div>
          </div>
          <div className='control__right'>
            <div className='control__navigation'>
              <FitBox>
                <Left dark={true} />
              </FitBox>
            </div>
            <div className='control__navigation'>
              <FitBox>
                <SettingsVerticalDots dark={true} />
              </FitBox>
            </div>
            <div className='control__navigation'>
              <FitBox>
                <Right dark={true} />
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
