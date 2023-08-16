import {promises as fs} from 'fs';
import {modifyReadmeqSingle} from '../src';

const splitPattern = 'Table of contents\n\n';

// get from build:typedocmd outputs
const postbuildTypedocmd = async () => {
  try {
    // get useful docs
    const fileData = await fs.readFile('./docs/modules.md', 'utf8');
    // split its unnecessary contents
    const matches = fileData.split(splitPattern);
    if (matches[1]) {
      // add to main README.md
      modifyReadmeqSingle('docsSection', matches[1], {
        n: true,
        backup: true,
      });
    }
  } catch (error) {
    throw error;
  }
};

// do it
postbuildTypedocmd();
