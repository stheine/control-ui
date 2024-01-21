import _ from 'lodash';
import React, {
  useContext,
} from 'react';

import MqttContext from '../../contexts/MqttContext.js';

const formatter = new Intl.DateTimeFormat('de-DE', {
  weekday: 'short',
  day:     'numeric',
  month:   'numeric',
});

export default function Muell() {
  const {messages} = useContext(MqttContext);

  const morgen   = messages['muell/leerung/morgen'];
  const naechste = messages['muell/leerung/naechste'];

  // console.log('Muell', {morgen});

  if(morgen?.length) {
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <span
                style={{
                  fontSize: '40%',
                  backgroundColor: '#ff0000',
                }}
              >
                {_.map(morgen, 'summary')}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  return (
    <table>
      <tbody>
        {_.map(naechste, leerung => {
          const {startDate, summary} = leerung;
          let   backgroundColor;
          let   color;

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
