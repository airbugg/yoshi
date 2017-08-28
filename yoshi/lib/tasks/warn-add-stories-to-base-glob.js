'use strict';

const chalk = require('chalk');
const glob = require('glob');
const path = require('path');

module.exports = ({projectConfig}) => {
  const features = projectConfig.features();
  const addStoriesToBaseGlob = features.addStoriesToBaseGlob;
  const isStoriesDir = glob.sync(path.join(process.cwd(), 'stories')).length !== 0;
  const deprecationMessage = 'DEPRECATED: Please enable addStoriesToBaseGlobin your package.json features section, see readme for details: https://github.com/wix/yoshi/blob/master/docs/ADD_STORIES_TO_BASE_GLOB.md';

  function warnIfNotOptimizeMoment() {
    if (isStoriesDir && !addStoriesToBaseGlob) {
      console.log(chalk.yellow(deprecationMessage));
    }

    return Promise.resolve();
  }

  return warnIfNotOptimizeMoment;
};
