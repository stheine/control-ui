import {vwId} from '../Auto/mqttConfig.js';

export default [{
  topic: 'auto/cmnd/vwTargetSocPending',
}, {
  topic: 'auto/tele/STATUS',
}, {
  topic: `carconnectivity/garage/${vwId}/charging/settings/target_level`,
}, {
  topic: 'Wallbox/evse/external_current',
}];
