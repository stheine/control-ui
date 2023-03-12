export default [{
  label: 'Außen',
  topic: 'tasmota/thermometer/tele/SENSOR',
  values: [{
    key:       'AM2301.Temperature',
    precision: 1,
    unit:      '°C',
  }, {
    key:       'AM2301.Humidity',
    precision: 0,
    unit:      '%rH',
  }],
}, {
  label: 'AußenVito',
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
    key:       'humidity',
    precision: 0,
    unit:      '%rH',
  }],
}, {
  label: 'Wohnen',
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
