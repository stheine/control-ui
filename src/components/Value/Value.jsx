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
  const valueStyle   = {};

  if(backgroundColor) {
    valueStyle.backgroundColor = backgroundColor;

    if(lightOrDark(backgroundColor) === 'light') {
      valueStyle.color = '#000000';
    }
  } else if(color) {
    valueStyle.color = color;
  }

  return [
    <td
      key='value'
      className={classNames([
        'value__value',
        value < 0 ? 'negative' : null,
        className,
      ])}
      colSpan={unit === null ? 2 : null}
    >
      <font
        className={classNames([
          backgroundColor ? 'background' : null,
        ])}
        style={valueStyle}
      >
        <font
          className={classNames([
            backgroundColor ? 'background-font' : null,
          ])}
        >
          {displayValue}
        </font>
      </font>
    </td>,
    unit === null ?
      null :
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
