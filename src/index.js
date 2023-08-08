import {promises as fs} from 'fs';
import * as path from 'path';


const basePath = process.cwd();
const backupsPath = path.join(basePath , '.readmeqBackups');
const backupSufix = `_backup${Date.now()}`;

/**
 * Backup options.
 * @typedef {Object} backupOptions
 * @property {string} basePath=`process.cwd()` - projects base/root path
 * @property {string} backupsPath=`path.join(basePath,'.readmeqBackups')` - backups path
 * @property {string} backupSufix=`_backup${Date.now()}` - backup file suffix (`file.ext` => `file${backupSufix}.ext`)
 */
const backupOptions = {
  basePath,
  backupsPath,
  backupSufix
};

/**
 * Modify options.
 * @typedef {Object} modifyOptions
 * @property {string} filePath=./README.md - path to modified file
 * @property {string} sectionStart=<!--READMEQ:KEY_VALUE--> - section start pattern, where `KEY_NAME` - your section key
 * @property {string} sectionEnd=<!--/READMEQ:KEY_VALUE--> - section end pattern, where `KEY_NAME` - your section key
 * @property {boolean} n=false - insert `newData` from new line (`\n` on start/end)
 * @property {boolean} backup=false - apply `backupReadmeq` method mefore modifying
 * @property {backupOptions} backupOptions - applying to `backupReadmeq` method if `backup=true`
 */
const modifyOptions = {
  filePath: './README.md',
  sectionStart: '<!--READMEQ:KEY_VALUE-->',
  sectionEnd: '<!--/READMEQ:KEY_VALUE-->',
  n: false,
  backup: false,
  backupOptions: backupOptions,
};

/**
 * Modify single `key` section.
 * @param {string} key - section key
 * @param {string} newData - section data
 * @param {modifyOptions} options - additional modify options
 * @returns {boolean} file modified (or throw some error)
 */
const modifyReadmeqSingle = async (key, newData, options = modifyOptions) => {
  try{

    // apply options
    options = {
      ...modifyOptions,
      ...options
    };

    // chck backup
    if (options.backup) {
      await backupReadmeq(options.filePath, options.backupOptions);
    }

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


/**
 * Backup readmeq modified file.
 * Use this method when its important to have **previous versions** of modified file. Or **any other cases** when its needed. 
 * @param {string} filePath - path to file
 * @param {backupOptions} options - additional backup options
 * @returns {string} backup file path (or throw some error)
 */
const backupReadmeq = async (filePath, options = backupOptions) => {
  try{

    // apply options
    options = {
      ...backupOptions,
      ...options
    };

    const fileFullPath = await fs.realpath(filePath);
    const fileInfo = path.parse(fileFullPath);
    const fileBaseDir = fileInfo.dir.replace(options.basePath, '');

    const fileBackupName = `${fileInfo.name}${options.backupSufix}${fileInfo.ext}`;
    const fileBackupPath = path.join(options.backupsPath, fileBaseDir, fileBackupName);

    await fs.cp(fileFullPath, fileBackupPath, {
      recursive: true
    });

    return fileBackupPath;

  } catch (error) {
    throw error;
  }
}


export { modifyReadmeqSingle, backupReadmeq };
