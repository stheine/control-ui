/* eslint-disable unicorn/prefer-at */

import _           from 'lodash';
import React       from 'react';
import {useParams} from 'react-router';

import Grid        from '../Grid/Grid.jsx';

import Casambi     from '../Casambi/Casambi.jsx';

const pages = {
  1: [
    {width: 3, content: <Casambi name='Mito raggio' />},
    null,
    {width: 3, content: <Casambi name='Mito volo' />},
  ],
};

export default function Light() {
  const params = useParams();
  const page = Number(params.page);

  // console.log('Light', {params, page, pages});

  return (
    <div className='control'>
      <title>Light</title>
      <Grid route='light' page={page} items={pages[page]} maxPages={Number(_.last(_.keys(pages)))} />
    </div>
  );
}
