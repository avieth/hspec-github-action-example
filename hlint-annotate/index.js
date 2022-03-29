const core = require('@actions/core');
/* To run locally, use this instead.
const core = {
  getInput: function (path) { return null; },
  setFailed: function (error) { console.error(error); },
  warning: function (message, meta) {
    console.warning(meta);
    console.warning(message);
  },
  error: function (message, meta) {
    console.error(meta);
    console.error(message);
  }
};
*/
const fs = require('fs');

const DEFAULT_FILE = 'hlint-report.json';

const isFile = (path) =>
  new Promise((resolve) => fs.stat(path, (error, stats) => resolve(!error && stats.isFile())));

const isUndefined = (x) =>
  typeof x === 'undefined';

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
        const hints = JSON.parse(data);
        hints.forEach(hint => {
          const message = hint.to
            ? `-- Found:\n${hint.from}\n-- Perhaps:\n${hint.to}`
            : `-- Remove:\n${hint.from}`;
          const properties = {
            endColumn: hint.endColumn,
            endLine: hint.endLine,
            file: hint.file,
            startColumn: hint.startColumn,
            startLine: hint.startLine,
            title: `${hint.severity}: ${hint.hint}`,
          };
          if (hint.severity == "Error") {
            core.error(message, properties);
          } else {
            core.warning(message, properties);
          }
        });
        if (hints.length > 0) {
          core.setFailed(`hlint gave ${hints.length} hint(s)`);
        }
      }
    });

  } catch (error) {
    core.setFailed(error);
  }
})();
