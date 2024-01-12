import inquirer from 'inquirer';
import * as fs from 'fs';
import { checkFileExists } from '../../helper/checkFileExists.js';
import { SwaggerService } from './swagger-service.js';

const prompt = inquirer.createPromptModule();
const ui = new inquirer.ui.BottomBar();

export class SwaggerTool {
  static async generateErrorCodeWithMessage() {
    const swaggerService = new SwaggerService();
    let { filePath } = await prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Enter file path:'
      }
    ]);

    // Check file exists
    if (!checkFileExists(filePath)) {
      ui.log.write(`File not found!`);
      process.exit(0);
    }

    // Read file
    let fileContent = await fs.promises.readFile(filePath, 'utf-8');

    // Generate getErrorsForSwagger function string 
    let getErrorsForSwaggerFunc = await swaggerService.genGetErrorsForSwaggerFunc(fileContent);

    // Write to file
    await swaggerService.writeGetErrorsForSwaggerFuncToFile(filePath, fileContent, getErrorsForSwaggerFunc);

    ui.log.write(`Successfully!`);
  }
}
