import {messagePrefix} from '../Auto/mqttConfig.js';

export default [{
  topic: 'auto/cmnd/vwTargetSocPending',
}, {
  topic: 'auto/tele/STATUS',
}, {
  topic: 'Wallbox/evse/external_current',
}, {
  topic: `${messagePrefix}/domains/charging/chargingSettings/targetSOC_pct`,
}];
