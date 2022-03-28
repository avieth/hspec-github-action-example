const core = require('@actions/core');
/* To run locally, use this instead.
const core = {
  getInput: function (path) { return null; },
  setFailed: function (error) { console.error(error); },
  error: function (message, meta) {
    console.error(meta);
    console.error(message);
  }
};
*/
const fs = require('fs');

const DEFAULT_FILE = 'hspec-failure-report.json';

const isFile = (path) =>
  new Promise((resolve) => fs.stat(path, (error, stats) => resolve(!error && stats.isFile())));

const isUndefined = (x) =>
  typeof x === 'undefined';

const messageFor = function (failureReason) {
  if (failureReason.type == "none") {
    return "no reason given";
  } else if (failureReason.type == "message") {
    if (!failureReason.message) {
      "no reason given";
    } else {
      failureReason.message;
    }
  } else if (failureReason.type == "expectation") {
    const body = `expected: ${failureReason.expected}
     got: ${failureReason.got}`;
    if (failureReason.message) {
      return `${failureReason.message}
${body}`;
    } else {
      return body;
    }
  } else if (failureReason.type == "error") {
    if (failureReason.message) {
      return `${failureReason.message}
${failureReason.error}`;
    } else {
      return `${failureReason.error}`;
    }
  }
};

(async () => {
  try {

    const file = core.getInput('file') || DEFAULT_FILE;
    const exists = await isFile(file);
    if (!exists) {
      throw new Error(`test output file ${file} does not exist`);
    }

    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        throw new Error(`failed to read ${file}: ${err}`);
      } else {
        /* Expected to be a JSON array */
        const failures = JSON.parse(data);
        failures.forEach(failure => {
          let file = undefined;
          let startLine = undefined;
          let startColumn = undefined;
          if (!(failure.location == null)) {
            file = failure.location.file;
            startLine = failure.location.line;
            startColumn = failure.location.column;
          }
          core.error(messageFor(failure.reason), {
              file: file,
              startLine: startLine,
              startColumn: startColumn,
              endLine: undefined,
              endColumn: undefined,
              title: failure.path
          });
        });
        if (failures.length > 0) {
          core.setFailed(`${failures.length} test(s) failed`);
        }
      }
    });

  } catch (error) {
    core.setFailed(error);
  }
})();
