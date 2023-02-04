import _         from 'lodash';
import {connect} from 'react-redux';
import mqtt      from 'async-mqtt';
import React, {
  useEffect,
  useState,
} from 'react';

const Temperature = function(props) {
  // eslint-disable-next-line no-unused-vars
  const {settings} = props; // TODO useContext settings/authentication/mqtt(?)

  // console.log('Temperature', {props, settings}); // TODO settings

  const [_temperature, setTemperature] = useState();

  useEffect(() => {
    let mqttClient;

    const initMqtt = async function() {
      try {
        mqttClient = await mqtt.connectAsync('tcp://192.168.6.7:9001'); // TODO from settings

        mqttClient.on('message', async(topic, messageBuffer) => {
          const messageRaw = messageBuffer.toString();
          let   message;

          try {
            message = JSON.parse(messageRaw);
          } catch {
            // ignore
            // logger.debug('JSON.parse', {messageRaw, errMessage: err.message});
          }

          switch(topic) {
            case 'vito/tele/SENSOR':
              // / eslint-disable-next-line no-console
              // console.log('tempAussen', message.tempAussen);
              setTemperature(message.tempAussen);
              break;

            default:
              // eslint-disable-next-line no-console
              console.log(`Unhandled topic '${topic}'`, message);
              break;
          }
        });

        await mqttClient.subscribe('vito/tele/SENSOR');
      } catch(err) {
        // eslint-disable-next-line no-console
        console.log('Failed to init', err.message);
      }
    };

    initMqtt();

    return async() => {
      await mqttClient.end();
    };
  }, []);

  const out = `${_.round(_temperature, 1)} °C`;

  return <span>{out}</span>;
};

const mapStateToProps = state => {
  const {settings} = state;

  return {settings};
};

export default connect(mapStateToProps)(Temperature);
