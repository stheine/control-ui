import _           from 'lodash';
import {connect}   from 'react-redux';
import React, {
  useContext,
} from 'react';

import AppContext  from '../../contexts/AppContext.js';
import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import Decrease    from '../../svg/sargam/Decrease.jsx';
import Increase    from '../../svg/sargam/Increase.jsx';
import PlayPause   from '../../svg/sargam/PlayPause.jsx';

const Volumio = function() {
  // console.log('Volumio');

  const {setAppDialog} = useContext(AppContext);
  const {messages, mqttClient} = useContext(MqttContext);

  const siteConfig = _.first(mqttConfig);

  const message = messages[siteConfig.topic];

  if(message) {
    // console.log('Volumio', {message});
  }

  return (
    <div
      className='volumioDiv'
      onClick={() => setAppDialog({content: 'VolumioDialog', header: 'Volumio', timeout: '30s'})}
    >
      <div className='volumio'>
        <div className='volumio__row'>
          <div className='volumio__control'>
            <PlayPause
              dark={true}
              onClick={async event => {
                event.stopPropagation();

                await mqttClient.publishAsync('volumio/cmnd/toggle', '');
              }}
            />
          </div>
          <div className='volumio__volume'>
            <Increase
              dark={true}
              onClick={async event => {
                event.stopPropagation();

                await mqttClient.publishAsync('volumio/cmnd/volume', '"+"');
              }}
            />
          </div>
        </div>
        <div className='volumio__row'>
          <div className='volumio__title'>
            <div className='volumio__title__value'>
              {message?.artist ? `${message.artist} - ` : null}{message?.title}
            </div>
          </div>
          <div className='volumio__volume'>
            <div className='volumio__volume__value'>
              {message?.volume}
            </div>
          </div>
        </div>
        <div className='volumio__row'>
          <div className='volumio__status'>
            {_.upperFirst(message?.status)}
          </div>
          <div className='volumio__volume'>
            <Decrease
              dark={true}
              onClick={async event => {
                event.stopPropagation();

                await mqttClient.publishAsync('volumio/cmnd/volume', '"-"');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Volumio);
