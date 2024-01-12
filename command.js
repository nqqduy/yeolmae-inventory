#!/usr/bin/env node
import inquirer from 'inquirer';
import { generateModule } from './tools/generate-module.js';
import { generateFeature } from './tools/generate-feature.js';
import { SwaggerTool } from './tools/swagger/swagger-tool.js';

const prompt = inquirer.createPromptModule();

async function receiveUserRequire() {
  const choices = [
    { name: 'Generate Module', handle: generateModule },
    { name: 'Generate Feature (api)', handle: generateFeature },
    { name: 'Generate define error code for swagger', handle: SwaggerTool.generateErrorCodeWithMessage }
  ];

  const questions = [
    {
      type: 'list',
      name: 'option',
      choices: choices.map((choice, index) => ({
        name: `${index + 1}. ${choice.name}`,
        value: choice.handle
      })),
      message: 'Welcome, which tool do you want to use?'
    }
  ];

  const answer = await prompt(questions);

  await answer.option();
}

receiveUserRequire();
