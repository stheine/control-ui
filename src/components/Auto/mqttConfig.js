export const messagePrefix = 'vwsfriend/vehicles/WVWZZZE1ZPP505932';

export default [{
  topic: 'auto/tele/STATUS',
}, {
  topic: 'Fronius/solar/tele/SENSOR',
}, {
  topic: 'vwsfriend/mqtt/weconnectConnected',
}, {
  topic: 'vwsfriend/mqtt/weconnectUpdated',
}, {
  topic: `${messagePrefix}/domains/charging/batteryStatus/cruisingRangeElectric_km`,
}, {
  topic: `${messagePrefix}/domains/charging/batteryStatus/currentSOC_pct`,
// }, {
//   topic: `${messagePrefix}/domains/charging/chargingStatus/chargePower_kW`,
// }, {
//   topic: `${messagePrefix}/domains/charging/chargingStatus/chargeType`,
// }, {
//   topic: `${messagePrefix}/domains/charging/chargingStatus/chargingState`,
// }, {
//   topic: `${messagePrefix}/domains/charging/chargingStatus/remainingChargingTimeToComplete_min`,
}, {
  topic: `${messagePrefix}/domains/charging/chargingSettings/targetSOC_pct`,
}];
