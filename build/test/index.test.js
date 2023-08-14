"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const src_1 = require("../src");
const tesingFilesPaths = [];
const testFilePath = 'test/README.md';
const testFileBackupPath = 'test/READMEBACKUP.md';
const constructTestingFile = async () => {
    const testData = `
# readmeq test file

<!--READMEQ:singleKey-->
singleKey data
<!--/READMEQ:singleKey-->

<!--READMEQ:someOtherKey-->
someOtherKey data inside
<!--/READMEQ:someOtherKey-->
  `;
    await fs_1.promises.writeFile(testFilePath, testData, 'utf8');
    tesingFilesPaths.push(testFilePath);
    const testBackupData = `
# readmeq backup test file

<!--READMEQ:singleKey-->
singleKey data
<!--/READMEQ:singleKey-->

<!--READMEQ:someOtherKey-->
someOtherKey data inside
<!--/READMEQ:someOtherKey-->
  `;
    await fs_1.promises.writeFile(testFileBackupPath, testBackupData, 'utf8');
    tesingFilesPaths.push(testFileBackupPath);
};
const destroyTestingFiles = async () => {
    tesingFilesPaths.forEach(async (filePath) => await fs_1.promises.unlink(filePath));
};
beforeAll(async () => {
    try {
        await constructTestingFile();
    }
    catch (error) {
        console.error(error);
    }
});
describe('basic readmeq functionality', () => {
    test('backup file', async () => {
        const result = await (0, src_1.backupReadmeq)(testFilePath);
        expect(result.status).toBe('ok');
        if (result.status === 'ok') {
            tesingFilesPaths.push(result.value);
            const exists = (0, fs_1.existsSync)(result.value);
            expect(exists).toBeTruthy();
        }
    });
    test('modify single key', async () => {
        const result = await (0, src_1.modifyReadmeqSingle)('singleKey', 'singleKey data MODIFIED', {
            n: true,
            filePath: testFilePath,
        });
        expect(result.status).toBe('ok');
        if (result.status === 'ok') {
            expect(result.value).toBe(true);
        }
    });
    test('restore file from latest backup', async () => {
        const result = await (0, src_1.restoreReadmeqLatest)(testFilePath, false);
        expect(result.status).toBe('ok');
        if (result.status === 'ok') {
            expect(result.value).toBe(true);
        }
    });
    test('restore file from specific backup', async () => {
        const result = await (0, src_1.restoreReadmeqFromPath)(testFilePath, testFileBackupPath, false);
        expect(result.status).toBe('ok');
        if (result.status === 'ok') {
            expect(result.value).toBe(true);
        }
    });
});
afterAll(async () => {
    try {
        await destroyTestingFiles();
    }
    catch (error) {
        console.error(error);
    }
});
//# sourceMappingURL=index.test.js.map