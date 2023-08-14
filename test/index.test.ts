import {promises as fs, existsSync} from 'fs';
import {
  modifyReadmeqSingle,
  backupReadmeq,
  restoreReadmeqLatest,
  restoreReadmeqFromPath,
  FilePath,
} from '../src';

const tesingFilesPaths: FilePath[] = [];
const testFilePath: FilePath = 'test/README.md';
const testFileBackupPath: FilePath = 'test/READMEBACKUP.md';

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
  await fs.writeFile(testFilePath, testData, 'utf8');
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
  await fs.writeFile(testFileBackupPath, testBackupData, 'utf8');
  tesingFilesPaths.push(testFileBackupPath);
};

const destroyTestingFiles = async () => {
  tesingFilesPaths.forEach(async filePath => await fs.unlink(filePath));
};

beforeAll(async () => {
  try {
    await constructTestingFile();
  } catch (error) {
    console.error(error);
  }
});

describe('basic readmeq functionality', () => {
  test('backup file', async () => {
    const result = await backupReadmeq(testFilePath);

    expect(result.status).toBe('ok');

    if (result.status === 'ok') {
      tesingFilesPaths.push(result.value);
      const exists = existsSync(result.value);
      expect(exists).toBeTruthy();
    }
  });

  test('modify single key', async () => {
    const result = await modifyReadmeqSingle(
      'singleKey',
      'singleKey data MODIFIED',
      {
        n: true,
        filePath: testFilePath,
      }
    );

    expect(result.status).toBe('ok');

    if (result.status === 'ok') {
      expect(result.value).toBe(true);
    }
  });

  test('restore file from latest backup', async () => {
    const result = await restoreReadmeqLatest(testFilePath, false);

    expect(result.status).toBe('ok');

    if (result.status === 'ok') {
      expect(result.value).toBe(true);
    }
  });

  test('restore file from specific backup', async () => {
    const result = await restoreReadmeqFromPath(
      testFilePath,
      testFileBackupPath,
      false
    );

    expect(result.status).toBe('ok');

    if (result.status === 'ok') {
      expect(result.value).toBe(true);
    }
  });
});

afterAll(async () => {
  try {
    await destroyTestingFiles();
  } catch (error) {
    console.error(error);
  }
});
