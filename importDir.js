import fsPromises from 'fs/promises';
import path       from 'path';

if(typeof require === 'function') {
  throw new Error('ImportDir can only be imported as an ES Module');
}

export default async function importDir(directory = '.', options = {}, currentDepth = 0) {
  if(directory.startsWith('.')) {
    throw new Error('Relative paths are not supported, please resolve your relative path to an absolute path.');
  }

  const extensions = options.extensions || ['.js'];
  const files = await fsPromises.readdir(directory);
  const filesBase = {};
  const map = {};

  for(const file of files) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);

    (filesBase[base] = filesBase[base] || []).push(file);

    const filesMinusDirs = {};

    for(const fileBase of filesBase[base]) {
      const abs = path.resolve(directory, fileBase);

      if((await fsPromises.stat(abs)).isDirectory()) {
        if(options.recurse && base !== 'node_modules') {
          if(options.recurseDepth) {
            if(options.recurseDepth > currentDepth) {
              map[base] = await importDir(abs, options, currentDepth + 1);
            }
          } else {
            map[base] = await importDir(abs, options);
          }
        }
      } else {
        filesMinusDirs[fileBase] = abs;
      }
    }

//    if(map[base]) {
//      continue;
//    }

    for(const extenstion of extensions) {
      const fileWithExt = base + extenstion;
      const abs = filesMinusDirs[fileWithExt];

      if(abs) {
        if(options.noCache) {
          map[base] = (await import(`file://${abs}?r=${Date.now()}`)).default;

          break;
        }

        map[base] = (await import(`file://${abs}`)).default;
        break;
      }
    }
  }

  return map;
}
