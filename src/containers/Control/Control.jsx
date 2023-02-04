import {connect}     from 'react-redux';
import Favicon       from 'react-favicon';
import mqtt          from 'async-mqtt';
import React, {
  useEffect,
  useState,
} from 'react';

import {Back}            from '../../svg/Back.jsx';
import faviconBase64     from '../../favicon.js';
import FitBox            from '../../components/FitBox.jsx';
import {Menu}            from '../../svg/Menu.jsx';
import MqttClientContext from '../../contexts/MqttClient.js';
import {Next}            from '../../svg/Next.jsx';
import {Play}            from '../../svg/Play.jsx';
import Solar             from '../Solar/Solar.jsx';
import {Stop}            from '../../svg/Stop.jsx';
import Temperature       from '../Temperature/Temperature.jsx';

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
                <Play />
              </FitBox>
            </div>
            <div className='control__action'>
              <FitBox>
                The quick brown fox jumps over the lazy dog
              </FitBox>
            </div>
            <div className='control__action'>
              <FitBox>
                Fit Me in here
              </FitBox>
            </div>
            <div className='control__action'>
              <FitBox>
                <Stop color='red' />
              </FitBox>
            </div>
            <div className='control__action'>
              <FitBox>
                <Solar />
              </FitBox>
            </div>
            <div className='control__action'>
              <FitBox>
                <Temperature />
              </FitBox>
            </div>
          </div>
          <div className='control__right'>
            <div className='control__navigation'>
              <FitBox>
                <Back />
              </FitBox>
            </div>
            <div className='control__navigation'>
              <FitBox>
                <Menu />
              </FitBox>
            </div>
            <div className='control__navigation'>
              <FitBox>
                <Next />
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
