import AppConfig           from './App/mqttConfig.js';
import AutoConfig          from './Auto/mqttConfig.js';
import AutoLadenConfig     from './AutoLaden/mqttConfig.js';
import DisplayConfig       from './Display/mqttConfig.js';
import DreameConfig        from './Dreame/mqttConfig.js';
import FensterConfig       from './Fenster/mqttConfig.js';
import Infrarotheizung     from './Infrarotheizung/mqttConfig.js';
import JalousieWohnen      from './JalousieWohnen/mqttConfig.js';
import LedsConfig          from './Leds/mqttConfig.js';
import MuellConfig         from './Muell/mqttConfig.js';
import PushButtonsConfig   from './PushButtons/mqttConfig.js';
import SolarConfig         from './Solar/mqttConfig.js';
import SolarForecastConfig from './SolarForecast/mqttConfig.js';
import StromConfig         from './Strom/mqttConfig.js';
import StrompreiseConfig   from './Strompreise/mqttConfig.js';
import TemperaturConfig    from './Temperatur/mqttConfig.js';
import VitoConfig          from './Vito/mqttConfig.js';
import VolumioConfig       from './Volumio/mqttConfig.js';
import WetterConfig        from './Wetter/mqttConfig.js';
import WetterDwdConfig     from './WetterDwd/mqttConfig.js';
import ZigbeeConfig        from './Zigbee/mqttConfig.js';

export default [
  ...AppConfig,
  ...AutoConfig,
  ...AutoLadenConfig,
  ...DisplayConfig,
  ...DreameConfig,
  ...FensterConfig,
  ...Infrarotheizung,
  ...JalousieWohnen,
  ...LedsConfig,
  ...MuellConfig,
  ...PushButtonsConfig,
  ...SolarConfig,
  ...SolarForecastConfig,
  ...StromConfig,
  ...StrompreiseConfig,
  ...TemperaturConfig,
  ...VitoConfig,
  ...VolumioConfig,
  ...WetterConfig,
  ...WetterDwdConfig,
  ...ZigbeeConfig,
];
