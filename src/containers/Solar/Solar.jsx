import _         from 'lodash';
import {connect} from 'react-redux';
import mqtt      from 'async-mqtt';
import React, {
  useEffect,
  useState,
} from 'react';

const Solar = function(props) {
  // eslint-disable-next-line no-unused-vars
  const {settings} = props; // TODO useContext settings/authentication/mqtt(?)

  // console.log('Solar', {props, settings}); // TODO settings

  const [_message, setMessage] = useState();

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
            case 'Fronius/solar/tele/SENSOR':
              // / eslint-disable-next-line no-console
              console.log({message});
              setMessage(message);
              break;

            default:
              // eslint-disable-next-line no-console
              console.log(`Unhandled topic '${topic}'`, message);
              break;
          }
        });

        await mqttClient.subscribe('Fronius/solar/tele/SENSOR');
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

  return (
    <table style={{padding: '0 30px 0 0'}}>
      <tbody>
        <tr>
          <td>Akku:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${_.round((_message?.battery.stateOfCharge || 0) * 100, 2)}% `}</td>
        </tr>
        <tr>
          <td>Leistung:</td>
          <td style={{whiteSpace: 'nowrap'}}>{`${_.round((_message?.inverter.powerOutgoing || 0) / 1000, 1)} kW`}</td>
        </tr>
      </tbody>
    </table>
  );
};

const mapStateToProps = state => {
  const {settings} = state;

  return {settings};
};

export default connect(mapStateToProps)(Solar);
