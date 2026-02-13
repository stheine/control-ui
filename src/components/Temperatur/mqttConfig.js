export default [{
  label: 'Außen',
  topic: 'vito/tele/SENSOR',
  values: [{
    key:       'tempAussen',
    precision: 1,
    unit:      '°C',
  }],
}, {
  label: 'Büro',
  topic: 'tasmota/espco2/tele/SENSOR',
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
}];
