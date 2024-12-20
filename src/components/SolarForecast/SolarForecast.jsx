import _     from 'lodash';
// import dayjs from 'dayjs';
import {
  Bar,
  BarChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import React, {
  useContext,
} from 'react';

const fields1 = [
  'totalPvHours',
  'highPvHours',
  'limitPvHours',
];
const fields2 = [
  'totalPvWh',
  'highPvWh',
  'limitPvWh',
];
const fields3 = [
  'tomorrowPvWh',
];

import MqttContext from '../../contexts/MqttContext.js';
// import Value       from '../Value/Value.jsx';

export default function SolarForecast() {
  const {messages} = useContext(MqttContext);

  const analysis = messages['solcast/analysis'];
  const {hourlyForecasts} = analysis;

  // console.log('SolarForecast', {analysis});

  let   previousForecast;
  const referenceLines = [];
  const graphForecasts = _.reduce(hourlyForecasts, (result, forecast) => {
    if(previousForecast?.timeH > forecast.timeH) {
      result.push({
        estimateWh: 0,
        timeH:      0,
      });

      const value = new Date(forecast.startDate).toLocaleDateString('de-DE', {weekday: 'long'});

      referenceLines.push(
        <ReferenceLine
          x={result.length - 1}
          stroke='gray'
          strokeWidth={1}
          label={{value, angle: -90, position: 'insideBottomLeft', offset: 20}}
        />
      );
    }

    result.push(forecast);

    previousForecast = forecast;

    return result;
  }, []);

  // console.log('SolarForecast', {graphForecasts});

  return (
    <>
      <BarChart width={900} height={300} data={graphForecasts} margin={{left: 30, top: 20}}>
        <Bar dataKey='estimateWh' fill='#fff800' isAnimationActive={false} label={{fontSize: 10, position: 'top'}} />
        <XAxis dataKey='timeH' />
        <YAxis
          dataKey='estimateWh'
          label={{value: 'Wh', angle: -90, position: 'insideLeft', offset: -15}}
          scale='linear'
          tickMargin={5}
        />
        {referenceLines}
      </BarChart>
      <table>
        <tbody>
          <tr>
            <td>
              <table>
                <tbody>
                  {fields1.map(field => (
                    <tr key={field}>
                      <td>
                        {field}
                      </td>
                      <td>
                        {analysis[field]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  {fields2.map(field => (
                    <tr key={field}>
                      <td>
                        {field}
                      </td>
                      <td>
                        {analysis[field]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
            <td>
              <table>
                <tbody>
                  {fields3.map(field => (
                    <tr key={field}>
                      <td>
                        {field}
                      </td>
                      <td>
                        {analysis[field]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

//    <table>
//      <tbody>
//        {forecasts.map(forecast => (
//          <tr>
//            <td style={{paddingRight: '20px'}}>
//              {dayjs(forecast.period_end).format('HH:mm')}
//            </td>
//            <Value value={_.round(forecast.pv_estimate, 1)} unit='kWh' />
//          </tr>
//        ))}
//      </tbody>
//    </table>
