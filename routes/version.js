/* eslint-disable no-underscore-dangle */

import path    from 'path';
import url     from 'url';

import fsExtra from 'fs-extra';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default async function version(params) {
  const {appConfig}   = params;
  const {environment} = appConfig;

  let packageJson = await fsExtra.readJson(path.join(__dirname, '..', 'package.json'));

  return {
    method:         'get',
    authentication: false,
    async fn(req, res) {
      if(environment !== 'production') {
        packageJson = await fsExtra.readJson(path.join(__dirname, '..', 'package.json'));
      }

      res.status(200).json({version: packageJson.version});
    },
  };
}
