import _           from 'lodash';
import {connect}   from 'react-redux';
import {replace}   from 'redux-first-history';
import React, {
  useContext,
} from 'react';

import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import Decrease    from '../../svg/sargam/Decrease.jsx';
import Dlf         from '../../svg/Dlf.jsx';
import Increase    from '../../svg/sargam/Increase.jsx';
import PlayPause   from '../../svg/sargam/PlayPause.jsx';

const Volumio = function(props) {
  const {dispatch} = props;

  // console.log('Volumio');

  const {messages, mqttClient} = useContext(MqttContext);

  const siteConfig = _.first(mqttConfig);

  const message = messages[siteConfig.topic];

  if(message) {
    // console.log('Volumio', {message});
  }

  return (
    <table className='volumio'>
      <tbody>
        <tr>
          <td className='volumio__control'>
            <Dlf dark={true} onClick={() => mqttClient.publish('volumio/cmnd/DLF', '')} />
          </td>
          <td rowSpan={3} className='volumio__title'>
            <div><span>{message?.artist ? `${message.artist} - ` : null}{message?.title}</span></div>
          </td>
          <td rowSpan={3} className='volumio__volume'>
            <div>
              <Increase dark={true} onClick={() => mqttClient.publish('volumio/cmnd/volume', '"+"')} />
              <span>{message?.volume}</span>
              <Decrease dark={true} onClick={() => mqttClient.publish('volumio/cmnd/volume', '"-"')} />
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <PlayPause
              dark={true}
              onClick={() => {
                mqttClient.publish('volumio/cmnd/playPause', '');

                if(message?.status === 'stop') {
                  dispatch(replace('/1'));
                }
              }}
            />
          </td>
        </tr>
        <tr>
          <td className='volumio__status'>{_.upperFirst(message?.status)}</td>
        </tr>
      </tbody>
    </table>
  );
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Volumio);
