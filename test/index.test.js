import {promises as fs, existsSync} from 'fs';
import {modifyReadmeqSingle, backupReadmeq} from '../src';


const testFilePath = './test/README.md';

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
  } catch (error) {
    throw error;
  }
};

const destroyTestingFiles = async () => {
  try{
    tesingFilesPaths.forEach(async filePath => await fs.unlink(filePath));
    // await fs.unlink(testFilePath);
  } catch (error) {
    throw error;
  }
};


beforeAll( async () => {
  await constructTestingFile();
});


describe('basic readmeq functionality', () => {

  test('single key', async () => {

    const result = await modifyReadmeqSingle('singleKey', 'singleKey data MODIFIED', {
      n: true,
      filePath: testFilePath
    });

    expect(result).toBe(true);

  });

  test('backup file', async () => {

    const backupPath = await backupReadmeq(testFilePath);
    tesingFilesPaths.push(backupPath);
    const exists = existsSync(backupPath);

    expect(exists).toBeTruthy();

  });

});


afterAll(async () => {
  await destroyTestingFiles();
});
