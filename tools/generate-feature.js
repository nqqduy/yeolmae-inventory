import inquirer from 'inquirer';
import { convertModuleNameIntoOtherName } from '../helper/convertModuleNameIntoOtherName.js';
import { genDirectoryStructure } from '../helper/genDirectoryStructure.js';
import { createFile, createFolder } from './generate-module.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import * as fs from 'fs';

const prompt = inquirer.createPromptModule();
const ui = new inquirer.ui.BottomBar();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function generateFeature() {
  const modulesPath = path.join(__dirname, '..', '..', '..', '/src/modules');
  const moduleNames = fs.readdirSync(modulesPath);

  let { moduleName } = await prompt([
    {
      type: 'list',
      name: 'moduleName',
      choices: moduleNames,
      message: 'which module do you want to create this feature: '
    }
  ]);

  let { featureName } = await prompt([
    {
      type: 'input',
      name: 'featureName',
      message: 'Enter feature name (example: get list artwork): '
    }
  ]);

  let passedValue = convertModuleNameIntoOtherName(
    featureName.trim().toLowerCase()
  );
  featureName = passedValue.input_value;

  const modulePath = path.join(modulesPath, moduleName);
  let result = convertModuleNameIntoOtherName(moduleName);

  moduleName = result.input_value;

  if (!fs.existsSync(modulePath)) {
    // create module folder
    fs.mkdirSync(modulePath);
    ui.log.write(`Create ${moduleName} module successfully`);
  }

  const { directories, featureFiles } = genDirectoryStructure(
    modulePath,
    moduleName,
    featureName
  );

  createFile(featureFiles, passedValue);
  createFolder(directories, true, passedValue);
}
