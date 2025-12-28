import React, {
  useCallback,
  useContext,
  useState,
} from 'react';

// import mqttConfig  from './mqttConfig.js';
import MqttContext from '../../contexts/MqttContext.js';

import Decrease    from '../../svg/sargam/Decrease.jsx';
import Down        from '../../svg/sargam/Down.jsx';
import Icon        from '../../svg/sargam/Icon.jsx';
import Increase    from '../../svg/sargam/Increase.jsx';
import Minus       from '../../svg/sargam/Minus.jsx';
import Plus        from '../../svg/sargam/Plus.jsx';
import Power       from '../../svg/sargam/Power.jsx';
import Up          from '../../svg/sargam/Up.jsx';

const buttonWidth = '65px';
const repeat      = 200;

const presets = {
  'Mito raggio': {
    Decke: {
      dimmer:      215,
      vertical:    50,
      temperature: 2898,
    },
    Lesen: {
      dimmer:      240,
      vertical:    180,
      temperature: 2898,
    },
  },
  'Mito volo': {
    Normal: {
      dimmer: 204,
      vertical: 227,
      temperature: 2868,
    },
  },
};

const range = {
  dimmer:      {min: 0,    max: 255},
  vertical:    {min: 0,    max: 255},
  temperature: {min: 2700, max: 4000},
};

const getInRange = function(value, change, min, max) {
  if(value === undefined) {
    return;
  }

  let out = value + change;

  if(out < min) {
    out = min;
  } else if(out > max) {
    out = max;
  }

  return out;
};

const Casambi = function(params) {
  const {messages, mqttClient} = useContext(MqttContext);
  const {name} = params;

  const [_downInterval, setDownInterval] = useState();

  const state = messages[`casambi/holzhaus/${name}/state`];

  // console.log('Casambi', {name, state});

//      <div>Dimmer: {state?.dimmer === undefined ? 'na' : state.dimmer}</div>
//      <div>Vertical: {state?.vertical === undefined ? 'na' : state.vertical}</div>
//      <div>Temperature: {state?.temperature === undefined ? 'na' : state.temperature}</div>

  const downHandler = useCallback((prop, diff) => {
    if(_downInterval) {
      clearInterval(_downInterval);
    }

    let value = state?.[prop];

    if(value === undefined) {
      return;
    }

    value = getInRange(value, diff, range[prop].min, range[prop].max);

    mqttClient.publishAsync(`casambi/holzhaus/${name}/cmnd`, JSON.stringify({[prop]: value}));

    setDownInterval(setInterval(() => {
      value = getInRange(value, diff, range[prop].min, range[prop].max);

      // console.log(`Update ${name}`, {prop, value});
      mqttClient.publishAsync(`casambi/holzhaus/${name}/cmnd`, JSON.stringify({[prop]: value}));
    }, repeat));
  }, [_downInterval, name, mqttClient, state]);
  const upHandler = useCallback(() => {
    if(_downInterval) {
      clearInterval(_downInterval);
      setDownInterval(undefined);
    }
  }, [_downInterval]);

  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'row', gap: '20px', fontSize: '30px'}}>
        <div style={{margin: '0 200px 0 30px'}}>{name}</div>
        {state?.on ?
          [
            <div key='d'>D: {state?.dimmer === undefined ? 'na' : state.dimmer}</div>,
            <div key='v'>V: {state?.vertical === undefined ? 'na' : state.vertical}</div>,
            <div key='t'>T: {state?.temperature === undefined ? 'na' : state.temperature}</div>,
          ] :
          <>Off</>
        }
      </div>
      <div>
        <table>
          <tbody>
            <tr>
              {Object.keys(presets[name]).map(preset => (
                <td key={`${name}-${preset}`} rowSpan={2} style={{width: '250px'}}>
                  <Icon
                    dark={true}
                    text={preset}
                    onClick={async() => await mqttClient.publishAsync(`casambi/holzhaus/${name}/cmnd`, JSON.stringify({
                      dimmer:      presets[name][preset].dimmer,
                      vertical:    presets[name][preset].vertical,
                      temperature: presets[name][preset].temperature,
                    }))}
                  />
                </td>
              ))}
              <td rowSpan={2} style={{width: '250px'}}>
                <Power
                  dark={true}
                  onClick={async() => await mqttClient.publishAsync(`casambi/holzhaus/${name}/cmnd`, JSON.stringify({
                    dimmer: 0,
                  }))}
                />
              </td>
              <td style={{width: buttonWidth}}>
                <Up
                  dark={true}
                  onMouseDown={() => downHandler('dimmer', 5)}
                  onMouseUp={() => upHandler()}
                />
              </td>
              <td style={{width: buttonWidth}}>
                <Increase
                  dark={true}
                  onMouseDown={() => downHandler('vertical', 5)}
                  onMouseUp={() => upHandler()}
                />
              </td>
              <td style={{width: buttonWidth}}>
                <Plus
                  dark={true}
                  onMouseDown={() => downHandler('temperature', 55)}
                  onMouseUp={() => upHandler()}
                />
              </td>
            </tr>
            <tr>
              <td style={{width: buttonWidth}}>
                <Down
                  dark={true}
                  onMouseDown={() => downHandler('dimmer', -5)}
                  onMouseUp={() => upHandler()}
                />
              </td>
              <td style={{width: buttonWidth}}>
                <Decrease
                  dark={true}
                  onMouseDown={() => downHandler('vertical', -5)}
                  onMouseUp={() => upHandler()}
                />
              </td>
              <td style={{width: buttonWidth}}>
                <Minus
                  dark={true}
                  onMouseDown={() => downHandler('temperature', -55)}
                  onMouseUp={() => upHandler()}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Casambi;
