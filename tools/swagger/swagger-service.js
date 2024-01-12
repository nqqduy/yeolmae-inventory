import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';
import * as fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class SwaggerService {
  async genGetErrorsForSwaggerFunc(fileContent) {
    let content = fileContent;
    const startStr = 'throw new ErrorException(';
    const lengthOfStartStr = startStr.length;
    const codeTemplatePath = path.join(__dirname, '..', '..', '/code-template');

    // Get error item template
    let errorItemTemplate = await fs.promises.readFile(
      codeTemplatePath + '/error-item-for-swagger-template.txt',
      'utf-8'
    );

    let errorItems = [];
    while (content.includes(startStr)) {
      // Find the start index of string: "throw new ErrorException("
      const iOfStartStr = content.indexOf(startStr);

      /* Get errorCodeAndMsg:
           "   AUTH_ERROR_CODE.EMAIL_ALREADY_EXISTS,
              'Email already exists'
           " 
        */
      let errorCodeAndMsg = '';
      for (let i = iOfStartStr + lengthOfStartStr; content[i] !== ')'; i++) {
        if (
          i === iOfStartStr + lengthOfStartStr &&
          (content[i] === '\n' || content[i] === '\t')
        )
          continue;
        errorCodeAndMsg += content[i];
      }

      errorCodeAndMsg = errorCodeAndMsg.trim();
      if (errorCodeAndMsg[errorCodeAndMsg.length - 1] === ',') {
        errorCodeAndMsg = errorCodeAndMsg.slice(0, errorCodeAndMsg.length - 1);
      }

      /* Get errorCode, errorMsg:
          errorCode = "AUTH_ERROR_CODE.EMAIL_ALREADY_EXISTS"
          errorMsg = "Email already exists"
        */
      let errorCode = errorCodeAndMsg.split(',')[0].trim();
      let errorMsg = errorCodeAndMsg.split(',')[1].trim();
      while (errorMsg.includes("'")) {
        errorMsg = errorMsg.replace("'", '');
      }

      // Add result
      let errorItemTemplateTmp = errorItemTemplate;
      errorItemTemplateTmp = errorItemTemplateTmp.replace(
        new RegExp('{__ERROR_CODE}', 'g'),
        errorCode
      );

      errorItemTemplateTmp = errorItemTemplateTmp.replace(
        new RegExp('{__ERROR_MESSAGE}', 'g'),
        errorMsg
      );
      errorItems.push(errorItemTemplateTmp);

      // remove startStr to avoid re-process
      content = content.replace(startStr, '');
    }

    // Read template file and Replace with result
    let result = await fs.promises.readFile(
      codeTemplatePath + '/get-errors-for-swagger-template.txt',
      'utf-8'
    );
    return result.replace(
      new RegExp('{__ARRAY_VALUE}', 'g'),
      errorItems.join('\n,')
    );
  }

  async writeGetErrorsForSwaggerFuncToFile(
    filePath,
    fileContent,
    contentToAppend
  ) {
    fileContent = fileContent.trim();
    let iToWrite = fileContent.at.length - 1;
    let numOfCloseBracket = 0;
    while (fileContent[iToWrite] !== '}' && numOfCloseBracket < 1) {
      iToWrite--;
      numOfCloseBracket++;
    }

    fileContent =
      fileContent.slice(0, iToWrite) +
      contentToAppend +
      '\n' +
      fileContent.slice(iToWrite, fileContent.length);
    await fs.promises.writeFile(filePath, fileContent);
  }
}
