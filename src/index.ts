import {promises as fs} from 'fs';
import * as path from 'path';

/**
 * Readmeq module.
 * @module readmeq
 */

const basePath: string = process.cwd();
const backupsPath: string = path.join(basePath, '.readmeqBackups');
const backupSuffix = `_backup${Date.now()}`;
const backupSuffixMatch = '_backup([0-9]+)';

// /**
//  * Backup options.
//  * @typedef {Object} BackupOptions
//  * @property {string} basePath=`process.cwd()` - projects base/root path
//  * @property {string} backupsPath=`path.join(basePath,'.readmeqBackups')` - backups path
//  * @property {string} backupSuffix=`_backup${Date.now()}` - backup file suffix (`file.ext` => `file${backupSuffix}.ext`)
//  * @property {string} backupSuffixMatch=`_backup([0-9]+)` - backup file suffing pattern (`RegEx`), where `([0-9]+)` -
//  * uniq time-based **integer** (**!important**) id of its backup version
//  */
/**
 * Backup options.
 */
export type BackupOptions = {
  /**
   * projects base/root path
   * @default `${process.cwd()}`
   * */
  basePath: string;
  /**
   * projects base/root path
   * @default `${path.join(basePath,'.readmeqBackups')}`
   * */
  backupsPath: string;
  /**
   * backup file suffix (`file.ext` => `file${backupSuffix}.ext`)
   * @default `_backup${Date.now()}`
   * */
  backupSuffix: string;
  /**
   * backup file suffing pattern (`RegEx`), where `([0-9]+)` -
   * uniq time-based **integer** (**!important**) id of its backup version
   * @default `_backup([0-9]+)`
   * */
  backupSuffixMatch: string;
};
const backupOptionsDefault: BackupOptions = {
  basePath,
  backupsPath,
  backupSuffix,
  backupSuffixMatch,
};

// /**
//  * Modify options.
//  * @typedef {Object} ModifyOptions
//  * @property {string} filePath=./README.md - path to modified file
//  * @property {string} sectionStart=<!--READMEQ:KEY_VALUE--> - section start pattern,
//  * where `KEY_NAME` (**!important**) - your section key
//  * @property {string} sectionEnd=<!--/READMEQ:KEY_VALUE--> - section end pattern,
//  * where `KEY_NAME` (**!important**) - your section key
//  * @property {boolean} n=false - insert `newData` from new line (`\n` on start/end)
//  * @property {boolean} backup=false - apply `backupReadmeq` method mefore modifying
//  * @property {BackupOptions} backupOptions=backupOptionsDefault - applying to `backupReadmeq` method if `backup=true`
//  */
/**
 * Modify options.
 * @type ModifyOptions
 */
export type ModifyOptions = {
  /**
   * path to modified file
   * @default './README.md'
   * */
  filePath: string;
  /**
   * section start pattern, where `KEY_NAME` (**!important**) - your section key
   * @default '<!--READMEQ:KEY_VALUE-->'
   * */
  sectionStart: string;
  /**
   * section end pattern, where `KEY_NAME` (**!important**) - your section key
   * @default '<!--/READMEQ:KEY_VALUE-->'
   * */
  sectionEnd: string;
  /**
   * insert `newData` from new line (`\n` on start/end)
   * @default false
   * */
  n: boolean;
  /**
   * apply `backupReadmeq` method mefore modifying
   * @default false
   * */
  backup: boolean;
  /**
   * applying to `backupReadmeq` method if `backup=true`
   * @default backupOptions
   * */
  backupOptions: BackupOptions;
};
const modifyOptionsDefault: ModifyOptions = {
  filePath: './README.md',
  sectionStart: '<!--READMEQ:KEY_VALUE-->',
  sectionEnd: '<!--/READMEQ:KEY_VALUE-->',
  n: false,
  backup: false,
  backupOptions: backupOptionsDefault,
};

/**
 * filePath data type (string)
 * @type FilePath
 */
export type FilePath = string;

/**
 * Result to return
 * @template T - value type of `status: 'ok'`
 */
export type Result<T> =
  | {
      /** status success @constant `'ok'` */
      status: 'ok';
      /** result value of `<T>` type */
      value: T;
    }
  | {
      /** status error @constant `'error'` */
      status: 'error';
      /** error value of `Error` type */
      error: Error;
    };

/**
 * Modify single `key` section.
 * @async
 * @param {string} key - section key
 * @param {string} newData - section data
 * @param {Partial<ModifyOptions>} options=modifyOptionsDefault - additional modify options
 * @return {Promise<Result<boolean>>} file modified (or throw some error)
 */
const modifyReadmeqSingle = async (
  key: string,
  newData: string,
  options?: Partial<ModifyOptions>
): Promise<Result<boolean>> => {
  try {
    // apply options
    const ops: ModifyOptions = {
      ...modifyOptionsDefault,
      ...options,
    };

    const fileData = await fs.readFile(ops.filePath, 'utf8');

    // chck backup
    if (ops.backup) {
      await backupReadmeq(ops.filePath, ops.backupOptions);
    }

    // search preparaitions
    const sectionStart = ops.sectionStart.replace('KEY_VALUE', key);
    const sectionEnd = ops.sectionEnd.replace('KEY_VALUE', key);

    const searchForRegexp = new RegExp(`${sectionStart}.*?${sectionEnd}`, 'gs');

    const sectionFound = fileData.match(searchForRegexp);

    if (sectionFound && sectionFound[0]) {
      // got one

      const newSection = `${sectionStart}${
        !ops.n ? newData : '\n' + newData + '\n'
      }${sectionEnd}`;

      // modify it
      const newFileData = fileData.replace(sectionFound[0], newSection);

      // write
      await fs.writeFile(ops.filePath, newFileData, 'utf8');

      // ok
      return {
        status: 'ok',
        value: true,
      };
    } else {
      // not found
      return {
        status: 'error',
        error: new Error(`single key '${key}' not found`),
      };
    }
  } catch (error: any) {
    // throw error;
    return {
      status: 'error',
      error: error,
    };
  }
};

/**
 * Backup readmeq modified file.
 * Use this method when its important to have **previous versions** of modified file. Or **any other cases** when its needed.
 * Use this method **on your own risk**.
 * @async
 * @param {string} filePath - path to file
 * @param {Partial<BackupOptions>} options=backupOptionsDefault - additional backup options
 * @return {Promise<Result<filePath>>} backup file path (or throw some error)
 */
const backupReadmeq = async (
  filePath: string,
  options?: Partial<BackupOptions>
): Promise<Result<FilePath>> => {
  try {
    // apply options
    const ops: BackupOptions = {
      ...backupOptionsDefault,
      ...options,
    };

    const fileFullPath = await fs.realpath(filePath);
    const fileInfo = path.parse(fileFullPath);
    const fileBaseDir = fileInfo.dir.replace(ops.basePath, '');

    const fileBackupName = `${fileInfo.name}${ops.backupSuffix}${fileInfo.ext}`;
    const fileBackupPath: FilePath = path.join(
      ops.backupsPath,
      fileBaseDir,
      fileBackupName
    );

    await fs.mkdir(path.join(ops.backupsPath, fileBaseDir), {
      recursive: true,
    });
    await fs.copyFile(fileFullPath, fileBackupPath);

    // ok
    return {
      status: 'ok',
      value: fileBackupPath,
    };
  } catch (error: any) {
    // throw error;
    return {
      status: 'error',
      error: error,
    };
  }
};

/**
 * Restore latest version of readmeq modified file. Based on its backup suffix.
 * Use this method **on your own risk**.
 * @async
 * @param {string} filePath - path to file
 * @param {boolean} backupBeforeRestore=true - backup current version of `filePath` before its restore
 * @param {Partial<BackupOptions>} options=backupOptionsDefault - additional backup options
 * @return {Promise<Result<boolean>>} file restored (or throw some error)
 */
const restoreReadmeqLatest = async (
  filePath: string,
  backupBeforeRestore = true,
  options?: Partial<BackupOptions>
): Promise<Result<boolean>> => {
  try {
    // apply options
    const ops: BackupOptions = {
      ...backupOptionsDefault,
      ...options,
    };

    const fileFullPath = await fs.realpath(filePath);
    const fileInfo = path.parse(fileFullPath);
    const fileBaseDir = fileInfo.dir.replace(ops.basePath, '');

    const fileBackupDir = path.join(ops.backupsPath, fileBaseDir);

    const fileNameExp = new RegExp(
      `${fileInfo.name}${ops.backupSuffixMatch}${fileInfo.ext}`
    );

    const backupDirFiles = await fs.readdir(fileBackupDir, {
      withFileTypes: false,
    });

    const backupDirFileVersions = backupDirFiles.filter(fileNameItem =>
      fileNameExp.test(fileNameItem)
    );

    // getting latest version
    let fileVersionIdLatest = 0;
    let fileVersionNameLatest = '';
    backupDirFileVersions.forEach(fileNameItem => {
      const match: string[] | null = fileNameItem.match(fileNameExp);
      if (match && fileVersionIdLatest < parseInt(match[1])) {
        fileVersionIdLatest = parseInt(match[1]);
        fileVersionNameLatest = fileNameItem;
      }
    });

    if (!fileVersionNameLatest) {
      // backup not found
      // throw new Error(`backup of '${filePath}' not found`);
      return {
        status: 'error',
        error: new Error(`backup of '${filePath}' not found`),
      };
    }

    // backup current version first
    if (backupBeforeRestore) {
      await backupReadmeq(filePath, ops);
    }

    // process
    await fs.copyFile(
      path.join(fileBackupDir, fileVersionNameLatest),
      fileFullPath
    );

    // ok
    return {
      status: 'ok',
      value: true,
    };
  } catch (error: any) {
    // throw error;
    return {
      status: 'error',
      error: error,
    };
  }
};

/**
 * Restore version of readmeq modified file from specific path.
 * Use this method **on your own risk**.
 * @async
 * @param {string} filePath - path to file
 * @param {string} backupFilePath - path to its backup file
 * @param {boolean} backupBeforeRestore=true - backup current version of `filePath` before its restore
 * @param {Partial<BackupOptions>} options=backupOptionsDefault - additional backup options
 * @return {Promise<Result<boolean>>} file restored (or throw some error)
 */
const restoreReadmeqFromPath = async (
  filePath: string,
  backupFilePath: string,
  backupBeforeRestore = true,
  options?: Partial<BackupOptions>
): Promise<Result<boolean>> => {
  try {
    // apply options
    const ops: BackupOptions = {
      ...backupOptionsDefault,
      ...options,
    };

    const fileFullPath = await fs.realpath(filePath);

    const backupFileFullPath = await fs.realpath(backupFilePath);

    // backup current version first
    if (backupBeforeRestore) {
      await backupReadmeq(filePath, ops);
    }

    // process
    await fs.copyFile(backupFileFullPath, fileFullPath);

    // ok
    return {
      status: 'ok',
      value: true,
    };
  } catch (error: any) {
    // throw error;
    return {
      status: 'error',
      error: error,
    };
  }
};

export {
  modifyReadmeqSingle,
  backupReadmeq,
  restoreReadmeqLatest,
  restoreReadmeqFromPath,
};
