import {promises as fs} from 'fs';
import {modifyReadmeqSingle} from '../src';


const testFilePath = './test/README.md';


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
  } catch (error) {
    throw error;
  }
};

const destroyTestingFile = async () => {
  try{
    await fs.unlink(testFilePath);
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

});


afterAll(async () => {
  await destroyTestingFile();
});
