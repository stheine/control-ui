import _           from 'lodash';
import {connect}   from 'react-redux';
import React, {
  useContext,
} from 'react';

import AppContext  from '../../contexts/AppContext.js';
import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import Play        from '../../svg/sargam/Play.jsx';
import Stop        from '../../svg/sargam/Stop.jsx';
import VolumeDown  from '../../svg/sargam/VolumeDown.jsx';
import VolumeUp    from '../../svg/sargam/VolumeUp.jsx';

const Button = function(props) {
  switch(props.status) {
    case 'stop':
      return <Play {...props} />;

    case 'play':
      return <Stop {...props} />;

    default:
      break;
  }
};

const Speaker = function() {
  // console.log('Speaker');

  const {setAppDialog} = useContext(AppContext);
  const {messages, mqttClient} = useContext(MqttContext);

  const siteConfig = _.first(mqttConfig);

  const message = messages[siteConfig.topic];

  if(message) {
    // console.log('Speaker', {message});
  }

  return (
    <div
      className='speakerDiv'
      onClick={() => setAppDialog({content: 'VolumioDialog', header: 'Volumio', timeout: '30s'})}
    >
      <div className='speaker'>
        <div className='speaker__row'>
          <div className='speaker__control'>
            <Button
              dark={true}
              status={message?.state}
              onClick={async event => {
                event.stopPropagation();

                switch(message.state) {
                  case 'play':
                    await mqttClient.publishAsync('music/stop', '');
                    break;

                  case 'stop':
                    await mqttClient.publishAsync('music/play',
                      'https://st01.sslstream.dlf.de/dlf/01/128/mp3/stream.mp3');
                    break;

                  default:
                    // eslint-disable-next-line no-console
                    console.log(`Unhandled state=${message.state}`);
                    break;
                }
              }}
            />
          </div>
          <div className='speaker__volume'>
            <VolumeUp
              dark={true}
              onClick={async event => {
                event.stopPropagation();

                await mqttClient.publishAsync('music/volume', '"+"');
              }}
            />
          </div>
        </div>
        <div className='speaker__row'>
          <div className='speaker__title'>
            <div className='speaker__title__value'>
              {message?.artist ? `${message.artist} - ` : null}{message?.title}
            </div>
          </div>
          <div className='speaker__volume'>
            <div className='speaker__volume__value'>
              {message?.volume}
            </div>
          </div>
        </div>
        <div className='speaker__row'>
          <div className='speaker__status'>
            {_.upperFirst(message?.status)}
          </div>
          <div className='speaker__volume'>
            <VolumeDown
              dark={true}
              onClick={async event => {
                event.stopPropagation();

                await mqttClient.publishAsync('music/volume', '"-"');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Speaker);
