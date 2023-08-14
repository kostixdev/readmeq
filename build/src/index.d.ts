/**
 * Backup options.
 */
export declare type BackupOptions = {
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
/**
 * Modify options.
 * @type ModifyOptions
 */
export declare type ModifyOptions = {
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
/**
 * filePath data type (string)
 * @type FilePath
 */
export declare type FilePath = string;
/**
 * Result to return
 * @template T - value type of `status: 'ok'`
 */
export declare type Result<T> = {
    /** status success @constant `'ok'` */
    status: 'ok';
    /** result value of `<T>` type */
    value: T;
} | {
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
declare const modifyReadmeqSingle: (key: string, newData: string, options?: Partial<ModifyOptions>) => Promise<Result<boolean>>;
/**
 * Backup readmeq modified file.
 * Use this method when its important to have **previous versions** of modified file. Or **any other cases** when its needed.
 * Use this method **on your own risk**.
 * @async
 * @param {string} filePath - path to file
 * @param {Partial<BackupOptions>} options=backupOptionsDefault - additional backup options
 * @return {Promise<Result<filePath>>} backup file path (or throw some error)
 */
declare const backupReadmeq: (filePath: string, options?: Partial<BackupOptions>) => Promise<Result<FilePath>>;
/**
 * Restore latest version of readmeq modified file. Based on its backup suffix.
 * Use this method **on your own risk**.
 * @async
 * @param {string} filePath - path to file
 * @param {boolean} backupBeforeRestore=true - backup current version of `filePath` before its restore
 * @param {Partial<BackupOptions>} options=backupOptionsDefault - additional backup options
 * @return {Promise<Result<boolean>>} file restored (or throw some error)
 */
declare const restoreReadmeqLatest: (filePath: string, backupBeforeRestore?: boolean, options?: Partial<BackupOptions>) => Promise<Result<boolean>>;
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
declare const restoreReadmeqFromPath: (filePath: string, backupFilePath: string, backupBeforeRestore?: boolean, options?: Partial<BackupOptions>) => Promise<Result<boolean>>;
export { modifyReadmeqSingle, backupReadmeq, restoreReadmeqLatest, restoreReadmeqFromPath, };
