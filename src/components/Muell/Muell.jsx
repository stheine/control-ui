// eslint-disable-next-line import/no-unassigned-import
import                      'dayjs/locale/de';

import _               from 'lodash';
import dayjs           from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime    from 'dayjs/plugin/relativeTime';
import React, {
  useContext,
} from 'react';

import Checked     from '../../svg/sargam/Checked.jsx';
import MqttContext from '../../contexts/MqttContext.js';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

const getColor = function(label) {
  let backgroundColor;
  let color;

  switch(label) {
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

  const renderRelative = date => {
    const now   = new Date();
    const start = new Date(date);

    return (
      <td style={{paddingBottom: '12px'}}>
        <span style={{fontSize: '120%'}}>
          {start < now ? 'Heute' : dayjs().locale('de').to(dayjs(date))}
        </span>
      </td>
    );
  };

  const renderDate = date => {
    const startDateFormatted = formatter.format(new Date(date));

    return (
      <td style={{paddingBottom: '12px'}}>
        <span style={{fontSize: '120%'}}>
          {startDateFormatted}
        </span>
      </td>
    );
  };

  const renderLabel = label => {
    const {backgroundColor, color} = getColor(label);

    return (
      <td colSpan={2}>
        <span
          style={{
            backgroundColor,
            color,
            fontSize:        '220%',
            padding:         '0 7px 0 7px',
          }}
        >
          {label}
        </span>
      </td>
    );
  };

  return (
    <table style={{padding: '10px 0 0 10px'}}>
      <tbody>
        {_.map(naechste, leerung => {
          const {startDate, summary} = leerung;

          return [
            <tr key='label'>
              {renderLabel(summary)}
            </tr>,
            <tr key='date'>
              {renderRelative(startDate)}
              {renderDate(startDate)}
            </tr>,
          ];
        })}
      </tbody>
    </table>
  );
}
