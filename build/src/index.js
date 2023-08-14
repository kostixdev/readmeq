"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreReadmeqFromPath = exports.restoreReadmeqLatest = exports.backupReadmeq = exports.modifyReadmeqSingle = void 0;
const fs_1 = require("fs");
const path = require("path");
/**
 * Readmeq module.
 * @module readmeq
 */
const basePath = process.cwd();
const backupsPath = path.join(basePath, '.readmeqBackups');
const backupSuffix = `_backup${Date.now()}`;
const backupSuffixMatch = '_backup([0-9]+)';
const backupOptionsDefault = {
    basePath,
    backupsPath,
    backupSuffix,
    backupSuffixMatch,
};
const modifyOptionsDefault = {
    filePath: './README.md',
    sectionStart: '<!--READMEQ:KEY_VALUE-->',
    sectionEnd: '<!--/READMEQ:KEY_VALUE-->',
    n: false,
    backup: false,
    backupOptions: backupOptionsDefault,
};
/**
 * Modify single `key` section.
 * @async
 * @param {string} key - section key
 * @param {string} newData - section data
 * @param {Partial<ModifyOptions>} options=modifyOptionsDefault - additional modify options
 * @return {Promise<Result<boolean>>} file modified (or throw some error)
 */
const modifyReadmeqSingle = async (key, newData, options) => {
    try {
        // apply options
        const ops = {
            ...modifyOptionsDefault,
            ...options,
        };
        const fileData = await fs_1.promises.readFile(ops.filePath, 'utf8');
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
            const newSection = `${sectionStart}${!ops.n ? newData : '\n' + newData + '\n'}${sectionEnd}`;
            // modify it
            const newFileData = fileData.replace(sectionFound[0], newSection);
            // write
            await fs_1.promises.writeFile(ops.filePath, newFileData, 'utf8');
            // ok
            return {
                status: 'ok',
                value: true,
            };
        }
        else {
            // not found
            return {
                status: 'error',
                error: new Error(`single key '${key}' not found`),
            };
        }
    }
    catch (error) {
        // throw error;
        return {
            status: 'error',
            error: error,
        };
    }
};
exports.modifyReadmeqSingle = modifyReadmeqSingle;
/**
 * Backup readmeq modified file.
 * Use this method when its important to have **previous versions** of modified file. Or **any other cases** when its needed.
 * Use this method **on your own risk**.
 * @async
 * @param {string} filePath - path to file
 * @param {Partial<BackupOptions>} options=backupOptionsDefault - additional backup options
 * @return {Promise<Result<filePath>>} backup file path (or throw some error)
 */
const backupReadmeq = async (filePath, options) => {
    try {
        // apply options
        const ops = {
            ...backupOptionsDefault,
            ...options,
        };
        const fileFullPath = await fs_1.promises.realpath(filePath);
        const fileInfo = path.parse(fileFullPath);
        const fileBaseDir = fileInfo.dir.replace(ops.basePath, '');
        const fileBackupName = `${fileInfo.name}${ops.backupSuffix}${fileInfo.ext}`;
        const fileBackupPath = path.join(ops.backupsPath, fileBaseDir, fileBackupName);
        await fs_1.promises.mkdir(path.join(ops.backupsPath, fileBaseDir), {
            recursive: true,
        });
        await fs_1.promises.copyFile(fileFullPath, fileBackupPath);
        // ok
        return {
            status: 'ok',
            value: fileBackupPath,
        };
    }
    catch (error) {
        // throw error;
        return {
            status: 'error',
            error: error,
        };
    }
};
exports.backupReadmeq = backupReadmeq;
/**
 * Restore latest version of readmeq modified file. Based on its backup suffix.
 * Use this method **on your own risk**.
 * @async
 * @param {string} filePath - path to file
 * @param {boolean} backupBeforeRestore=true - backup current version of `filePath` before its restore
 * @param {Partial<BackupOptions>} options=backupOptionsDefault - additional backup options
 * @return {Promise<Result<boolean>>} file restored (or throw some error)
 */
const restoreReadmeqLatest = async (filePath, backupBeforeRestore = true, options) => {
    try {
        // apply options
        const ops = {
            ...backupOptionsDefault,
            ...options,
        };
        const fileFullPath = await fs_1.promises.realpath(filePath);
        const fileInfo = path.parse(fileFullPath);
        const fileBaseDir = fileInfo.dir.replace(ops.basePath, '');
        const fileBackupDir = path.join(ops.backupsPath, fileBaseDir);
        const fileNameExp = new RegExp(`${fileInfo.name}${ops.backupSuffixMatch}${fileInfo.ext}`);
        const backupDirFiles = await fs_1.promises.readdir(fileBackupDir, {
            withFileTypes: false,
        });
        const backupDirFileVersions = backupDirFiles.filter(fileNameItem => fileNameExp.test(fileNameItem));
        // getting latest version
        let fileVersionIdLatest = 0;
        let fileVersionNameLatest = '';
        backupDirFileVersions.forEach(fileNameItem => {
            const match = fileNameItem.match(fileNameExp);
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
        await fs_1.promises.copyFile(path.join(fileBackupDir, fileVersionNameLatest), fileFullPath);
        // ok
        return {
            status: 'ok',
            value: true,
        };
    }
    catch (error) {
        // throw error;
        return {
            status: 'error',
            error: error,
        };
    }
};
exports.restoreReadmeqLatest = restoreReadmeqLatest;
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
const restoreReadmeqFromPath = async (filePath, backupFilePath, backupBeforeRestore = true, options) => {
    try {
        // apply options
        const ops = {
            ...backupOptionsDefault,
            ...options,
        };
        const fileFullPath = await fs_1.promises.realpath(filePath);
        const backupFileFullPath = await fs_1.promises.realpath(backupFilePath);
        // backup current version first
        if (backupBeforeRestore) {
            await backupReadmeq(filePath, ops);
        }
        // process
        await fs_1.promises.copyFile(backupFileFullPath, fileFullPath);
        // ok
        return {
            status: 'ok',
            value: true,
        };
    }
    catch (error) {
        // throw error;
        return {
            status: 'error',
            error: error,
        };
    }
};
exports.restoreReadmeqFromPath = restoreReadmeqFromPath;
//# sourceMappingURL=index.js.map