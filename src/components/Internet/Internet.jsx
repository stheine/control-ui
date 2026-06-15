import {use}       from 'react';

import MqttContext from '../../contexts/MqttContext.js';

export default function Internet() {
  const {messages} = use(MqttContext);

  const message = messages['dns/failed'];
  const ok = !message;

  return (
    <table className='internet'>
      <tbody>
        <tr>
          <td>
            <div className='header'>
              Internet
            </div>
          </td>
        </tr>
        <tr>
          <td className='content'>
            <div className={`content__value ${ok ? 'ok' : 'failed'}`}>
              {ok ? 'OK' : message}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
