import _ from 'lodash';
import React, {
  useContext,
} from 'react';

import Checked     from '../../svg/sargam/Checked.jsx';
import MqttContext from '../../contexts/MqttContext.js';

const getColor = function(summary) {
  let backgroundColor;
  let color;

  switch(summary) {
    case 'Biomüll':
      backgroundColor = '#00cc00';
      color           = '#000000';
      break;
    case 'Papier':
      backgroundColor = '#0000ff';
      color           = '#ffffff';
      break;
    case 'Restmüll':
      backgroundColor = '#444444';
      color           = '#ffffff';
      break;
    default:
      backgroundColor = '#00ffff';
      break;
  }

  return {backgroundColor, color};
};

const formatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short',
  day:     'numeric',
  month:   'numeric',
});

export default function Muell() {
  const {messages, mqttClient} = useContext(MqttContext);

  const morgen   = messages['muell/leerung/morgen'];
  const naechste = messages['muell/leerung/naechste'];

  // console.log('Muell', {morgen});

  if(morgen?.length) {
    return (
      <table style={{width: '100%'}}>
        <tbody>
          {_.map(morgen, leerung => {
            const {summary} = leerung;
            const {backgroundColor, color} = getColor(summary);

            return [
              <tr key={summary}>
                <td style={{textAlign: 'center'}}>
                  <span
                    style={{
                      backgroundColor,
                      color,
                      fontSize: '40%',
                      padding:  '0 15px 0 15px',
                    }}
                  >
                    {summary}
                  </span>
                </td>
              </tr>,
              <tr key={`${summary} button`}>
                <td style={{textAlign: 'center'}}>
                  <div style={{width: '80px', paddingLeft: '100px'}}>
                    <Checked
                      dark={true}
                      onClick={() => mqttClient.publish('muell/leerung/morgen', null, {retain: true})}
                    />
                  </div>
                </td>
              </tr>,
            ];
          })}
        </tbody>
      </table>
    );
  }

  return (
    <table>
      <tbody>
        {_.map(naechste, leerung => {
          const {startDate, summary} = leerung;
          const {backgroundColor, color} = getColor(summary);

          const startDateFormatted =
            formatter.format(new Date(startDate));

          return (
            <tr key={summary}>
              <td>
                <span
                  style={{
                    fontSize: '50%',
                  }}
                >
                  {startDateFormatted}
                </span>
              </td>
              <td>
                <span
                  style={{
                    backgroundColor,
                    color,
                    fontSize:        '50%',
                    padding:         '0 7px 0 7px',
                  }}
                >
                  {summary}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
