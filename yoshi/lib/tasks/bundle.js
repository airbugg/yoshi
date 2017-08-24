'use strict';

const _ = require('lodash/fp');
const webpack = require('webpack');
const getConfig = require('../../config/webpack.config.client');
const {shouldRunWebpack, filterNoise, inTeamCity, readDir, copyFile} = require('../utils');
const {statics} = require('../globs');

function runBundle(webpackOptions) {
  const webpackConfig = getConfig(webpackOptions);

  if (!shouldRunWebpack(webpackConfig)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    filterNoise(webpack(webpackConfig)).run((err, stats) => {
      if (err || stats.hasErrors()) {
        return reject(err);
      }

      return resolve();
    });
  });
}

function omitMinExt(filePath) {
  return filePath.replace(/(.+\.)min\.(js|css)$/, '$1min.$2');
}

function copyFilesAsDebug() {
  const promises = readDir(`${statics()}/**/*.+(js|css)`)
    .map(filePath => copyFile(filePath, omitMinExt(filePath)));

  return Promise.all(promises);
}

function bundle({analyze}) {
  const minBundle = runBundle({debug: false, analyze});
  const debugBundle = inTeamCity() ? runBundle({debug: true}) : minBundle.then(copyFilesAsDebug);

  return Promise.all([minBundle, debugBundle]);
}

module.exports = ({logIf}) => {
  return logIf(bundle, _.compose(shouldRunWebpack, getConfig));
};
