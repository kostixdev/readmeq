import * as jsdoc2md from 'jsdoc-to-markdown';
import {modifyReadmeqSingle} from '../src';

jsdoc2md
  .render({files: './build/src/*'})
  .then((output: string) => {
    modifyReadmeqSingle('docsSection', output, {
      n: true,
      backup: true,
    });
  })
  .catch((error: any) => {
    console.error(error);
  });
