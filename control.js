'use strict';

const path                  = require('path');

const _                     = require('lodash');
const compression           = require('compression');
const express               = require('express');

const faviconBase64         = require('./src/favicon');
const logger = require('./logger');
const packageJson           = require('./package');
const routes                = require('./routes');

(async() => {
  // eslint-disable-next-line no-console
  console.log('\x1B]2;control\x07'); // windowTitle
  logger.info(`-------------------- Startup --------------------`);
  logger.info(`${packageJson.name} ${packageJson.version}`);

  // Init express
  const app = express();

  // Enable compression
  app.use(compression());

  // Register routes for static files. No authentication.
  app.use('/', express.static(path.join(__dirname, 'build')));

  // Register route for favicon. No authentication.
  app.use('/favicon.ico', async(req, res) =>
    res.set({'Content-type': 'image/png'}).send(Buffer.from(faviconBase64, 'base64')));

  // Sends human-readable json output in res.json()
  app.set('json spaces', 2);

  // Register routes from the routes directory
  const registerRoutes = async function(routes, path) {
    for(const [key, value] of Object.entries(routes)) {
      if(_.isPlainObject(value)) {
        await registerRoutes(value, (path ? `${path}/` : '') + key);

        continue;
      }

      if(typeof value !== 'function') {
        throw new Error(`routes[${key}] not a function`);
      }

      const route = await value(params);
      const authentication = _.isNil(route.authentication) ? true : route.authentication;
      const withMulter = _.isNil(route.multer) ? false : route.multer;
      const functions = [];
      let   url = route.url || `/${key}`;

      if(typeof route.fn !== 'function') {
        throw new Error(`routes[${key}].fn not a function`);
      }

      if(_.isRegExp(url)) {
        throw new Error(`RegExp handling needed for '${key}'`);
      }

      if(authentication) {
        functions.push(tokenMiddleware);
      }
      if(withMulter) {
        functions.push(multer({dest: 'attachments/'}).any());
      }

      functions.push(route.fn);

      url = '/api' + (path ? `/${path}` : '') + url;
      app[route.method](url, functions);

      logger.trace(`Registered ` +
        `${authentication ? 'auth' : 'open'} ` +
        `${withMulter ? 'multer' : 'basic'} ` +
        `route ` +
        `${route.method.toUpperCase()} ${url}`);
    }
  };
  /* eslint-enable no-shadow */

  await registerRoutes(routes);

  // catch 404 and forward to error handler
  app.use((req, res) => {
  //  logger.error(req);
    const err = new Error(`Not Found: ${req.method} ${req.originalUrl}`);

    err.status = 404;

    if(environment !== 'production') {
      // development error handler
      // will print stacktrace

      logger.error(err.status + ' - ' + err.message, err);
      res.status(err.status).json({
        message: err.message,
        error:   err,
      });
    } else {
      // production error handler
      // no stacktrace leaked to user

      // logger.error(err.status + ' - ' + err.message, err);
      res.status(err.status).json({
        message: err.message,
        error:   {},
      });
    }
  });

  /* eslint-disable no-unused-vars */
  if(environment !== 'production') {
    app.use((err, req, res, next) => {
      let status = 500;

      if(err.status) {
        status = err.status;
      }

      logger.error(status + ' - ' + err.message, err);
      res.status(status).json({
        message: err.message,
        details: err.details,
        error:   err,
      });
    });
  }

  // Startup web server
  let server;

  if(appConfig.scheme === 'https') {
    server = https.createServer({cert, key}, app);
  } else {
    server = http.createServer(app);
  }

  server.on('error', async err => {
    if(err.code === 'EADDRINUSE') {
      const {stdout} = await execa('/bin/netstat', ['-tulpn']);
      const stdoutLines = stdout.split('\n');
      const usingProcessLine = _.find(stdoutLines, line => line.includes(`:::${serverPort}`));
      const usingProcessId = usingProcessLine.replace(/^.* (\d+)\/node .*$/, '$1');

      logger.error(`Server port '${serverPort}' already in use by process ${usingProcessId}`);
    } else if(environment !== 'production') {
      logger.error(err);
    }

    process.exit(2);
  });

  server.listen(serverPort, async err => {
    if(err) {
      throw err;
    }

    logger.info(`Server: ${appConfig.scheme}://${hostName}:${serverPort}`);

    const line = readline.createInterface({
      input:  process.stdin,
      output: process.stdout,
    });

    while(true) {
      await new Promise(resolve => {
        line.question('', resolve);
      });

      for(let i = 0; i < windowSize.get().height; i++) {
        console.log('');
      }
    }
  });
})();
