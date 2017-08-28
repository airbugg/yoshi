'use strict';

const {CLIEngine} = require('eslint');
const {readDir, logIfAny} = require('./utils');

module.exports = ({logIf, base}) => {
  const files = ['*.js', `${base()}/**/*.js`];

  function eslint({fix} = {fix: false}) {
    return new Promise((resolve, reject) => {
      const cli = new CLIEngine({cache: true, cacheLocation: 'target/.eslintcache', fix});
      const report = cli.executeOnFiles(files);
      fix && CLIEngine.outputFixes(report);
      const formatter = cli.getFormatter();
      logIfAny(formatter(report.results));
      const errors = CLIEngine.getErrorResults(report.results);
      return errors.length ? reject() : resolve();
    });
  }

  return logIf(eslint, () => readDir(files).length > 0);
};
