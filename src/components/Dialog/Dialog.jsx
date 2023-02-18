import React from 'react';

import Close from '../../svg/sargam/Close.jsx';

export default function Dialog(props) {
  const {children, onClose} = props;

  return (
    <div className='dialog-layer'>
      <div className='dialog-layer__center'>
        <div className='dialog-layer__center__border'>
          <div className='dialog-layer__center__border__header'>
            <div className='dialog-layer__center__border__header__text'>Notification</div>
            <div className='dialog-layer__center__border__header__blank' />
            <div className='dialog-layer__center__border__header__closer' onClick={onClose}><Close /></div>
          </div>
          <div className='dialog-layer__center__border__content'>{children}</div>
        </div>
      </div>
    </div>
  );
}
