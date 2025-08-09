export default [{
  label: 'AußenFunk',
  topic: 'Zigbee/LuftSensor Außen',
  values: [{
    key:       'temperature',
    precision: 1,
    unit:      '°C',
  }, {
    className: 'small',
    key:       'humidity',
    precision: 0,
    unit:      '%rH',
  }],
}, {
  label: 'AußenTasmota',
  topic: 'tasmota/thermometer/tele/SENSOR',
  values: [{
    key:       'AM2301.Temperature',
    precision: 1,
    unit:      '°C',
  }, {
    className: 'small',
    key:       'AM2301.Humidity',
    precision: 0,
    unit:      '%rH',
  }],
}, {
  label: 'Außen',
  topic: 'vito/tele/SENSOR',
  values: [{
    key:       'tempAussen',
    precision: 1,
    unit:      '°C',
  }],
}, {
  label: 'Büro',
  topic: 'Zigbee/LuftSensor Büro',
  values: [{
    key:       'temperature',
    precision: 1,
    unit:      '°C',
  }, {
    className: 'small',
    key:       'humidity',
    precision: 0,
    unit:      '%rH',
  }],
}, {
  label: 'Wohnen',
  topic: 'Zigbee/LuftSensor Wohnzimmer',
  values: [{
    key:       'temperature',
    precision: 1,
    unit:      '°C',
  }, {
    className: 'small',
    key:       'humidity',
    precision: 0,
    unit:      '%rH',
  }],
}, {
  label: 'WohnenRaspi',
  topic: 'Wohnzimmer/tele/SENSOR',
  values: [{
    key:       'temperature',
    precision: 1,
    unit:      '°C',
  }, {
    key:       'humidity',
    precision: 0,
    unit:      '%rH',
  }],
}];
