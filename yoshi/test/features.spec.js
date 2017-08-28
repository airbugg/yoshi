const {expect} = require('chai');
const {killSpawnProcessAndHisChildren} = require('./helpers/process');
const tp = require('./helpers/test-phases');
const fx = require('./helpers/fixtures');
const retryPromise = require('retry-promise').default;

describe('features', () => {
  let test, child, res;

  beforeEach(() => {
    test = tp.create();
    child = null;
  });

  afterEach(() => {
    test.teardown();
    return killSpawnProcessAndHisChildren(child);
  });

  describe('add stories to base glob', () => {
    const deprecationMessageStart = 'DEPRECATED: Please enable addStoriesToBaseGlobin';

    describe('when package.json flag configured and you have stories directory', () => {
      beforeEach(() => {
        test.setup({
          'package.json': fx.packageJson({
            features: {
              addStoriesToBaseGlob: true
            },
          }),
          'stories/example.js': {
            hey: 'oh'
          }
        });
      });

      it('should not warn on build command', () => {
        res = test.execute('build');
        expect(res.stdout).to.not.contain(deprecationMessageStart);
      });
    });

    describe(`when package.json flag configured and you don't have stories directory`, () => {
      beforeEach(() => {
        test.setup({
          'package.json': fx.packageJson({
            features: {
              addStoriesToBaseGlob: true
            },
          }),
        });
      });

      it('should not warn on build command', () => {
        res = test.execute('build');
        expect(res.stdout).to.not.contain(deprecationMessageStart);
      });
    });


    describe('when package.json flag is not configured and you have stories directory', () => {
      beforeEach(() => {
        test.setup({
          'package.json': fx.packageJson(),
          'stories/example.js': {
            hey: 'oh'
          }
        });
      });

      it('should warn on build command', () => {
        res = test.execute('build');
        expect(res.stdout).to.contain(deprecationMessageStart);
      });

      it('should warn on start command', () => {
        child = test.spawn('start');
        return checkStdout(deprecationMessageStart);
      });
    });

    function checkStdout(str) {
      return retryPromise({backoff: 100}, () =>
        test.stdout.indexOf(str) > -1 ?
          Promise.resolve() :
          Promise.reject()
      );
    }
  });
});
