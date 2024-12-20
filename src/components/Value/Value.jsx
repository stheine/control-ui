import _     from 'lodash';
import React from 'react';

export default function Value(props) {
  const {value, unit} = props;

  const displayValue = value;
  let   valueStyle;

  if(_.isNumber(value)) {
//    if(value < 1000) {
//      displayValue = _.round(value);
//    } else {
//      displayValue = _.round(value / 1000, 1).toFixed(1);
//    }
  } else {
    valueStyle   = {fontSize: '60%', paddingBottom: '11px', paddingTop: '3px'};
  }

  return [
    <td
      key='value'
      className={`value__value${value < 0 ? ' negative' : ''}`}
      style={valueStyle}
    >
      {displayValue}
    </td>,
    <td
      key='unit'
      className='value__unit'
    >
      {unit}
    </td>,
  ];
}
