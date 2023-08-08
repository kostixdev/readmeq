import jsdoc2md from 'jsdoc-to-markdown';
import {modifyReadmeqSingle} from '../src/index.js';

jsdoc2md.render({files: './src/index.js'}).then(output => {
  modifyReadmeqSingle('docsSection', output, {
    n: true,
    backup: true
  });
});
