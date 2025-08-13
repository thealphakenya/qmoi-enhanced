// release.config.js
module.exports = {
  bumpFiles: [
    {
      filename: 'package.json',
      type: 'json'
    },
    {
      filename: 'package-lock.json',
      type: 'json'
    }
  ],
  header: '# Changelog\n\nAll notable changes to this project will be documented in this file.\n\n',
  types: [
    { type: 'feat', section: 'Features' },
    { type: 'fix', section: 'Bug Fixes' },
    { type: 'chore', section: 'Miscellaneous' },
    { type: 'docs', section: 'Documentation' },
    { type: 'style', section: 'Styling' },
    { type: 'refactor', section: 'Refactoring' },
    { type: 'perf', section: 'Performance' },
    { type: 'test', section: 'Tests' }
  ],
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',
  releaseCommitMessageFormat: 'chore(release): {{currentTag}}',
  tagPrefix: 'v'
};
