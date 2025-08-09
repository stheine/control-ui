/* eslint-disable react/no-array-index-key */

import _     from 'lodash';
import dayjs from 'dayjs';
import {
  Bar,
  BarChart,
  Cell,
  ReferenceArea,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import React, {
  useContext,
} from 'react';

import MqttContext from '../../contexts/MqttContext.js';

const strokeOpacity = 0.5;
const strokeWidth   = 5;

export default function Strompreise() {
  const {messages} = useContext(MqttContext);

  const now               = dayjs();
  const strompreise       = messages['strom/tele/preise'];
  const futureStrompreise = _.reduce(strompreise, (result, strompreis) => {
    if(dayjs(strompreis.startTime) < now.subtract(1, 'hour')) {
      return result;
    }

    result.push({
      ...strompreis,
      timeH: Number(dayjs(strompreis.startTime).format('H')),
    });

    return result;
  }, []).slice(0, 24);
  const sunTimes = messages['sunTimes/INFO'];
  const {sunrise, sunset, sunriseTomorrow, sunsetTomorrow} = sunTimes;

  const yDomain = [0, 'auto'];
  const maxCent           = _.max(_.map(futureStrompreise, 'cent'));
  const minCent           = _.min(_.map(futureStrompreise, 'cent'));

  const sunriseHour = sunrise > now ?
    dayjs(sunrise).hour() :
    dayjs(sunriseTomorrow).hour();
  const sunsetHour  = sunset > now ?
    dayjs(sunset).hour() :
    dayjs(sunsetTomorrow).hour();

  let   startH = null;
  let   endH   = null;
  let   aktuellerHintergrund;
  const hintergruende = [];

  for(const timeH of _.map(futureStrompreise, 'timeH')) {
    if(startH === null) {
      startH = timeH;
    }
    if(endH === null) {
      endH = timeH;
    }

    if(timeH === sunriseHour) {
      hintergruende.push(
        <ReferenceArea
          key='nacht'
          x1={startH}
          x2={timeH - 1}
          y1={maxCent}
          y2={0}
          stroke='gray'
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
          label={{value: 'Nacht', angle: 0, position: 'insideTop', offset: 50}}
        />
      );
      startH = null;
      aktuellerHintergrund = 'Nacht';
    } else if(timeH === sunsetHour) {
      hintergruende.push(
        <ReferenceArea
          key='tag'
          x1={startH}
          x2={timeH - 1}
          y1={maxCent}
          y2={0}
          stroke='yellow'
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
          label={{value: 'Tag', angle: 0, position: 'insideTop', offset: 50}}
        />
      );
      startH = null;
      aktuellerHintergrund = 'Tag';
    }
  }

  if(startH !== null) {
    hintergruende.push(
      <ReferenceArea
        key='naechster'
        x1={startH}
        x2={_.map(futureStrompreise, 'timeH').at(-1)}
        y1={maxCent}
        y2={0}
        stroke={aktuellerHintergrund === 'Nacht' ? 'yellow' : 'gray'}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        label={{value: aktuellerHintergrund === 'Nacht' ? 'Tag' : 'Nacht', angle: 0, position: 'insideTop', offset: 50}}
        ifOverflow='hidden'
      />
    );
    startH = null;
    aktuellerHintergrund = 'Tag';
  }

  // console.log({sunriseHour, sunsetHour});

  // console.log('Strompreise', {strompreise, sunTimes});

  if(minCent < 0) {
    yDomain[0] = minCent - 0.5;
  }

  return (
    <BarChart width={980} height={500} data={futureStrompreise} margin={{left: 10, top: 20}}>
      {hintergruende}
      <Bar
        dataKey='cent'
        fill='#000088'
        isAnimationActive={false}
        label={{fontSize: 10, position: 'top'}}
      >
        {futureStrompreise.map((entry, index) => {
          let fill;

          switch(entry.level) {
            case 'VERY_EXPENSIVE': fill = '#ff0000'; break;
            case 'EXPENSIVE':      fill = '#880000'; break;
            case 'NORMAL':         fill = '#000088'; break;
            case 'CHEAP':          fill = '#008800'; break;
            case 'VERY_CHEAP':     fill = '#00ff00'; break;

            default:
              fill = '#dddddd';
              break;
          }

          return <Cell key={`cell-${index}`} fill={fill} />;
        })}
      </Bar>
      <ReferenceLine
        x={sunriseHour}
        stroke='orange'
        strokeWidth={2}
        label={{value: 'Sonnenaufgang', angle: -90, position: 'insideBottomLeft', offset: 20}}
      />
      <ReferenceLine
        x={sunsetHour}
        stroke='orange'
        strokeWidth={2}
        label={{value: 'Sonnenuntergang', angle: -90, position: 'insideBottomLeft', offset: 20}}
      />
      <XAxis
        dataKey='timeH'
      />
      <YAxis
        dataKey='cent'
        domain={yDomain}
        interval={0}
        label={{value: 'Cent', angle: -90, position: 'insideLeft'}}
        scale='linear'
        tickMargin={5}
      />
    </BarChart>
  );
}
//    <>
//      <div style={{columnCount: _.ceil(futureStrompreise.length / 6), columnRule: 'solid 1px gray'}}>
//        {futureStrompreise.map(strompreis => (
//          <div key={strompreis.startTime}>
//            <span style={{paddingRight: '20px'}}>
//              {dayjs(strompreis.startTime).format('HH:mm')}
//            </span>
//            <span
//              style={{
//                backgroundColor: strompreis.cent === maxCent ?
//                  '#ee0000' :
//                  (strompreis.cent === minCent ?
//                    '#00cc00' :
//                    null
//                  ),
//              }}
//            >
//              {_.round(strompreis.cent, 1)} ct
//            </span>
//          </div>
//        ))}
//      </div>
//      <div>
//          // chart
//      </div>
//    </>
