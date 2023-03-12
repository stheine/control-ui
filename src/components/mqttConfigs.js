import AppConfig        from './App/mqttConfig.js';
import ButtonsConfig    from './Buttons/mqttConfig.js';
import DisplayConfig    from './Display/mqttConfig.js';
import DreameConfig     from './Dreame/mqttConfig.js';
import FensterConfig    from './Fenster/mqttConfig.js';
import LedsConfig       from './Leds/mqttConfig.js';
import SolarConfig      from './Solar/mqttConfig.js';
import TemperaturConfig from './Temperatur/mqttConfig.js';
import VitoConfig       from './Vito/mqttConfig.js';
import VolumioConfig    from './Volumio/mqttConfig.js';
import WetterConfig     from './Wetter/mqttConfig.js';
import WetterDwdConfig  from './WetterDwd/mqttConfig.js';

export default [
  ...AppConfig,
  ...ButtonsConfig,
  ...DisplayConfig,
  ...DreameConfig,
  ...FensterConfig,
  ...LedsConfig,
  ...SolarConfig,
  ...TemperaturConfig,
  ...VitoConfig,
  ...VolumioConfig,
  ...WetterConfig,
  ...WetterDwdConfig,
];
