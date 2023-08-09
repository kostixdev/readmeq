import {promises as fs, existsSync} from 'fs';
import {
  modifyReadmeqSingle,
  backupReadmeq,
  restoreReadmeqLatest,
  restoreReadmeqFromPath
} from '../src';


const testFilePath = './test/README.md';
const testFileBackupPath = './test/READMEBACKUP.md';


const tesingFilesPaths = [];

const constructTestingFile = async () => {
  try{
    
    const testData = `
# readmeq test file

<!--READMEQ:singleKey-->
singleKey data
<!--/READMEQ:singleKey-->

<!--READMEQ:someOtherKey-->
someOtherKey data inside
<!--/READMEQ:someOtherKey-->
    `;
    await fs.writeFile(testFilePath, testData, 'utf8' );
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
    await fs.writeFile(testFileBackupPath, testBackupData, 'utf8' );
    tesingFilesPaths.push(testFileBackupPath);

  } catch (error) {
    throw error;
  }
};

const destroyTestingFiles = async () => {
  try{
    tesingFilesPaths.forEach(async filePath => await fs.unlink(filePath));
  } catch (error) {
    throw error;
  }
};


beforeAll( async () => {
  await constructTestingFile();
});


describe('basic readmeq functionality', () => {

  test('backup file', async () => {

    const backupPath = await backupReadmeq(testFilePath);
    tesingFilesPaths.push(backupPath);
    const exists = existsSync(backupPath);

    expect(exists).toBeTruthy();

  });

  test('modify single key', async () => {

    const result = await modifyReadmeqSingle('singleKey', 'singleKey data MODIFIED', {
      n: true,
      filePath: testFilePath
    });

    expect(result).toBe(true);

  });

  test('restore file from latest backup', async () => {

    const result = await restoreReadmeqLatest(testFilePath, false);

    expect(result).toBe(true);

  });

  test('restore file from specific backup', async () => {

    const result = await restoreReadmeqFromPath(testFilePath, testFileBackupPath, false);

    expect(result).toBe(true);

  });

});


afterAll(async () => {
  await destroyTestingFiles();
});
