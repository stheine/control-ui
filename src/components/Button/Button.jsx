import classNames from 'classnames';
import React      from 'react';

export default function Button(props) {
  const {active, children, onClick} = props;

  // console.log('button', {props});

  return (
    <div
      className={classNames([
        'button',
        active ? 'active' : null,
      ])}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
