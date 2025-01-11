import _          from 'lodash';
import classNames from 'classnames';
import React      from 'react';

const lightOrDark = function(color) {
  const matches = color.match(/^#(?<r>..)(?<g>..)(?<b>..)$/);

  if(!matches) {
    return;
  }

  // console.log({matches});

  // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
  const hsp = Math.sqrt(
    0.299 * Number(`0x${matches.groups.r}`) ** 2 +
    0.587 * Number(`0x${matches.groups.g}`) ** 2 +
    0.114 * Number(`0x${matches.groups.b}`) ** 2
  );

  // Using the HSP value, determine whether the color is light or dark
  if(hsp > 127.5) {
    return 'light';
  }

  return 'dark';
};

export default function Value(props) {
  const {backgroundColor, className, color, value, unit, unitOn} = props;

  const displayValue = value;
  const fontStyle    = {};
  const valueStyle   = {};

  valueStyle.width = '100px';

  if(_.isNumber(value)) {
//    if(value < 1000) {
//      displayValue = _.round(value);
//    } else {
//      displayValue = _.round(value / 1000, 1).toFixed(1);
//    }
  } else {
    valueStyle.fontSize      = '60%';
    valueStyle.paddingBottom = '11px';
    valueStyle.paddingTop    = '3px';
  }

  if(backgroundColor) {
    fontStyle.backgroundColor = backgroundColor;

    if(lightOrDark(backgroundColor) === 'light') {
      fontStyle.color = '#000000';
    }

    fontStyle.borderRadius    = '5px';
    fontStyle.padding         = '0 8px 0 8px';
  } else if(color) {
    fontStyle.color = color;
  }

  return [
    <td
      key='value'
      className={classNames([
        'value__value',
        value < 0 ? 'negative' : null,
        className,
      ])}
      style={valueStyle}
    >
      <font style={fontStyle}>
        {displayValue}
      </font>
    </td>,
    <td
      key='unit'
      className={classNames([
        'value__unit',
        unitOn === 'bottom' ? 'value__unit__on-bottom' : null,
        unitOn === 'top' ? 'value__unit__on-top' : null,
        className,
      ])}
    >
      {unit}
    </td>,
  ];
}
