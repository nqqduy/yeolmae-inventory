#!/usr/bin/env node
import { convertModuleNameIntoOtherName } from '../helper/convertModuleNameIntoOtherName.js';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import * as fs from 'fs';
import { genDirectoryStructure } from '../helper/genDirectoryStructure.js';
import { getNameFromPath } from '../helper/getNameFromPath.js';

const prompt = inquirer.createPromptModule();
const ui = new inquirer.ui.BottomBar();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const codeTemplatePath = path.join(__dirname, '..', '/code-template');

export function createFile(files, passedValue) {
  if (!files?.length) return;
  const { inputValue, input_value, INPUT_VALUE, InputValue } = passedValue;

  files.map(async (file) => {
    if (!fs.existsSync(file.path)) {
      let data = fs.readFileSync(
        codeTemplatePath + `/${file.type}-template.txt`,
        'utf8'
      );
      data = data.replace(new RegExp('{inputValue}', 'g'), inputValue);
      data = data.replace(new RegExp('{input-value}', 'g'), input_value);
      data = data.replace(new RegExp('{INPUT_VALUE}', 'g'), INPUT_VALUE);
      data = data.replace(new RegExp('{InputValue}', 'g'), InputValue);

      fs.writeFileSync(file.path, data);
      ui.log.write(`Create ${getNameFromPath(file.path)} file successfully`);
    }
  });
}

export function createFolder(
  _directories,
  isGenFeatureFiles = false,
  passedValue
) {
  if (!_directories) return;

  for (let directory in _directories) {
    const { path, directories, moduleFiles, featureFiles } =
      _directories[directory];

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
      ui.log.write(`Create ${getNameFromPath(path)} folder successfully`);
    }

    const files = isGenFeatureFiles ? featureFiles : moduleFiles;
    createFile(files, passedValue);
    createFolder(directories, isGenFeatureFiles, passedValue);
  }
}

function createFolderAndFilesInModule(modulePath, moduleName, passedValue) {
  const { directories, moduleFiles } = genDirectoryStructure(
    modulePath,
    moduleName
  );
  createFile(moduleFiles, passedValue);
  createFolder(directories, false, passedValue);
}

export async function generateModule() {
  let { moduleName } = await prompt([
    {
      type: 'input',
      name: 'moduleName',
      message: 'Enter module name: '
    }
  ]);

  moduleName = moduleName.trim().toLowerCase();
  let passedValue = convertModuleNameIntoOtherName(moduleName);

  moduleName = passedValue.input_value;

  const modulePath = path.join(
    __dirname,
    '..',
    '..',
    '..',
    '/src/modules',
    moduleName
  );

  if (!fs.existsSync(modulePath)) {
    // create module folder
    fs.mkdirSync(modulePath);
    ui.log.write(`Create ${moduleName} module successfully`);
  }

  createFolderAndFilesInModule(modulePath, moduleName, passedValue);
}
