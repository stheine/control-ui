import {connect} from 'react-redux';
import Favicon   from 'react-favicon';
import React     from 'react';

import faviconBase64        from '../../favicon.js';

const Control = function(props) {
  console.log('Control', {props});

  return (
    <div>
      <Favicon url={`data:image/png;base64,${faviconBase64}`} />
      <b>control</b> control control
    </div>
  );
};

const mapStateToProps = state => {
  const {settings} = state;

  return {settings};
};

export default connect(mapStateToProps)(Control);
