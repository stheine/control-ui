import _     from 'lodash';
import dayjs from 'dayjs';
import {
  // Cell,
  // LabelList,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import React, {
  useContext,
  useMemo,
} from 'react';

import Button      from '../Button/Button.jsx';
import MqttContext from '../../contexts/MqttContext.js';

const buttons = {
  null: 'Aus',
  40:   '4kW',
  80:   '8kW',
};

const strokeOpacity = 0.5;
const strokeWidth   = 5;

export default function Strompreise() {
  const {messages, mqttClient} = useContext(MqttContext);

  const gridChargePct = _.isNil(messages['Fronius/solar/cmnd/gridChargePct']) ?
    messages['Fronius/solar/cmnd/gridChargePct'] :
    String(messages['Fronius/solar/cmnd/gridChargePct']);
  const messageStatus = messages['Fronius/solar/tele/STATUS'];

  const now               = dayjs();
  const strompreise       = messages['strom/tele/preise'];
  const firstStartTime    = strompreise.at(0).startTime;
  const futureStrompreise = useMemo(() => _.reduce(strompreise, (result, strompreis) => {
    if(dayjs(strompreis.startTime) < now.subtract(1, 'hour')) {
      return result;
    }

    result.push({
      ...strompreis,
      timeH: Number(dayjs(strompreis.startTime).format('H')),
      label: dayjs(strompreis.startTime).format('H:mm'),
    });

    return result;
  }, []).slice(0, 96),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [firstStartTime]);
  const sunTimes = messages['sunTimes/INFO'];
  const {sunrise, sunset, sunriseTomorrow, sunsetTomorrow} = sunTimes;

  const yDomain = [0, 'auto'];
  const maxCent = useMemo(() => _.max(_.map(futureStrompreise, 'cent')),
    [futureStrompreise]);
  const minCent = useMemo(() => _.min(_.map(futureStrompreise, 'cent')),
    [futureStrompreise]);

  const sunriseHour = sunrise > now ?
    dayjs(sunrise).hour() :
    dayjs(sunriseTomorrow).hour();
  const sunsetHour  = sunset > now ?
    dayjs(sunset).hour() :
    dayjs(sunsetTomorrow).hour();

  let   startLabel = null;
  let   endLabel   = null;
  let   aktuellerHintergrund;
  const hintergruende = [];

  for(const strompreis of futureStrompreise) {
    const {timeH, label} = strompreis;

    if(startLabel === null) {
      startLabel = label;
    }
    if(endLabel === null) {
      endLabel = label;
    }

    if(!label.endsWith(':00')) {
      continue;
    }

    if(timeH === sunriseHour) {
      hintergruende.push(
        <ReferenceArea
          key='nacht'
          x1={startLabel}
          x2={label}
          y1={maxCent}
          y2={0}
          stroke='gray'
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
          label={{value: 'Nacht', angle: 0, position: 'insideTop', offset: 50}}
        />
      );
      startLabel = null;
      aktuellerHintergrund = 'Nacht';
    } else if(timeH === sunsetHour) {
      hintergruende.push(
        <ReferenceArea
          key='tag'
          x1={startLabel}
          x2={label}
          y1={maxCent}
          y2={0}
          stroke='yellow'
          strokeOpacity={strokeOpacity}
          strokeWidth={strokeWidth}
          label={{value: 'Tag', angle: 0, position: 'insideTop', offset: 50}}
        />
      );
      startLabel = null;
      aktuellerHintergrund = 'Tag';
    }
  }

  if(startLabel !== null) {
    hintergruende.push(
      <ReferenceArea
        key='naechster'
        x1={startLabel}
        x2={_.map(futureStrompreise, 'label').at(-1)}
        y1={maxCent}
        y2={0}
        stroke={aktuellerHintergrund === 'Nacht' ? 'yellow' : 'gray'}
        strokeOpacity={strokeOpacity}
        strokeWidth={strokeWidth}
        label={{value: aktuellerHintergrund === 'Nacht' ? 'Tag' : 'Nacht', angle: 0, position: 'insideTop', offset: 50}}
        ifOverflow='hidden'
      />
    );
    startLabel = null;
    aktuellerHintergrund = 'Tag';
  }

  // console.log({sunriseHour, sunsetHour});

  // console.log('Strompreise', {strompreise, sunTimes});

  if(minCent < 0) {
    yDomain[0] = minCent - 0.5;
  }

  const CustomizedDot = props => {
    const {cx, cy, payload} = props;

    let fill;

    switch(payload.level) {
      case 'VERY_EXPENSIVE': fill = '#ff0000'; break;
      case 'EXPENSIVE':      fill = '#880000'; break;
      case 'NORMAL':         fill = '#000088'; break;
      case 'CHEAP':          fill = '#008800'; break;
      case 'VERY_CHEAP':     fill = '#00ff00'; break;

      default:
        fill = '#dddddd';
        break;
    }

    return (
      <svg x={cx - 10} y={cy - 10} width={20} height={20} viewBox='0 0 20 20'>
        <circle cx={10} cy={10} r={5} fill={fill} />
      </svg>
    );
  };

  // console.log(futureStrompreise);

  const {printKeysAbove, printKeysBelow} = useMemo(() => {
    let   previousStrompreis;
    const newPrintKeysAbove = [];
    const newPrintKeysBelow = [];

    for(const [key, strompreis] of futureStrompreise.entries()) {
      // console.log(strompreis);

      const nextStrompreis = futureStrompreise[key + 1];

      if(!previousStrompreis) {
        if(strompreis.cent > nextStrompreis.cent) {
          newPrintKeysAbove.push(key);
        } else {
          newPrintKeysBelow.push(key);
        }
      } else if(!nextStrompreis) {
        if(strompreis.cent > previousStrompreis.cent) {
          newPrintKeysAbove.push(key);
        } else {
          newPrintKeysBelow.push(key);
        }
      } else if(strompreis.cent > previousStrompreis.cent &&
        strompreis.cent > nextStrompreis.cent
      ) {
        newPrintKeysAbove.push(key);
      } else if(strompreis.cent < previousStrompreis.cent &&
        strompreis.cent < nextStrompreis.cent
      ) {
        newPrintKeysBelow.push(key);
      }

      previousStrompreis = strompreis;
    }

    return {printKeysAbove: newPrintKeysAbove, printKeysBelow: newPrintKeysBelow};
  }, [futureStrompreise]);

  let key = 0;

  const CustomizedLabel = ({x, y, stroke, value}) => {
    let printValue = null;
    let dy;

    if(key >= futureStrompreise.length) {
      key = 0;
    }

    if(printKeysAbove.includes(key)) {
      printValue = value;
      dy = -8;
    } else if(printKeysBelow.includes(key)) {
      printValue = value;
      dy = 16;
    }

    key++;

    if(printValue !== null) {
      return (
        <text x={x} y={y} dy={dy} fill={stroke} fontSize={10} textAnchor='middle'>
          {printValue}
        </text>
      );
    }
  };

  return (
    <div className='strompreise'>
      <div className='chart'>
        <ResponsiveContainer>
          <LineChart data={futureStrompreise} margin={{left: 10, top: 20}}>
            {hintergruende}
            <Line
              dataKey='cent'
              fill='#000088'
              isAnimationActive={false}
              label={<CustomizedLabel />}
              dot={<CustomizedDot />}
            />
            <ReferenceLine
              x={`${sunriseHour}:00`}
              stroke='orange'
              strokeWidth={2}
              label={{value: 'Sonnenaufgang', angle: -90, position: 'insideBottomLeft', offset: 20}}
            />
            <ReferenceLine
              x={`${sunsetHour}:00`}
              stroke='orange'
              strokeWidth={2}
              label={{value: 'Sonnenuntergang', angle: -90, position: 'insideBottomLeft', offset: 20}}
            />
            <XAxis
              dataKey='label'
              angle={0}
              minTickGap={20}
              tickMargin={5}
              ticks={_.filter(_.map(futureStrompreise, 'label'), label => label.endsWith(':00'))}
            />
            <YAxis
              dataKey='cent'
              domain={yDomain}
              interval={0}
              label={{value: 'Cent', angle: -90, position: 'insideLeft'}}
              scale='linear'
              tickMargin={5}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className='buttons'>
        <div className='label'>Akku:</div>
        <Button
          key='akkuCharge'
          className='button'
          active={messageStatus?.chargeMax}
          onClick={async event => {
            event.stopPropagation();

            const cmndData = {};

            if(messageStatus?.chargeMax) {
              cmndData.chargeMax = null;
              cmndData.chargeTo  = null;
            } else {
              cmndData.chargeMax = true;
              cmndData.chargeTo  = 100;
            }

            await mqttClient.publishAsync('Fronius/solar/cmnd', JSON.stringify(cmndData));
          }}
        >
          Max
        </Button>

        <div style={{width: '50px'}} />

        <div className='label'>Netzladen:</div>
        {Object.keys(buttons).map(button => (
          <Button
            key={button}
            className='button'
            active={button === gridChargePct || button === 'null' && !gridChargePct}
            onClick={async() => await mqttClient.publishAsync('Fronius/solar/cmnd/gridChargePct',
              button === 'null' ? null : button,
              {retain: true})}
          >
            {buttons[button]}
          </Button>
        ))}
      </div>
    </div>
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
