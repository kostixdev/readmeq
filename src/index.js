import {promises as fs} from 'fs';


const modifyOptions = {
  filePath: './README.md',
  sectionStart: `<!--READMEQ:KEY_VALUE-->`,
  sectionEnd: `<!--/READMEQ:KEY_VALUE-->`,
  n : false,
};

const modifyReadmeqSingle = async (key, newData, options = modifyOptions) => {
  try{

    // apply options
    options = {
      ...modifyOptions,
      ...options
    };

    const fileData = await fs.readFile(options.filePath, 'utf8');

    // search preparaitions
    const sectionStart = options.sectionStart.replace('KEY_VALUE', key);
    const sectionEnd = options.sectionEnd.replace('KEY_VALUE', key);

    const searchForRegexp = new RegExp(
      `${sectionStart}.*?${sectionEnd}`,
      'gs'
    );
    
    const sectionFound = fileData.match(searchForRegexp);

    if (sectionFound && sectionFound[0]) {
      // got one

      const newSection = `${sectionStart}${(!options.n)?newData:'\n'+newData+'\n'}${sectionEnd}`;

      // modify it
      const newFileData = fileData.replace(sectionFound[0], newSection);

      // write
      await fs.writeFile(options.filePath, newFileData, 'utf8');

      return true;

    } else {
      // not found
      throw new Error(`single key '${key}' not found`);
    }

  } catch (error) {
    throw error;
  }
};


export { modifyReadmeqSingle };
