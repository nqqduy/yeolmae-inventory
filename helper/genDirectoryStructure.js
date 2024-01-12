export function genDirectoryStructure(
  modulePath,
  moduleName,
  featureName = null
) {
  return {
    directories: {
      api: {
        path: modulePath + '/api',
        directories: {
          http: {
            path: modulePath + '/api/http',
            directories: {
              controllers: {
                path: modulePath + '/api/http/controllers',
                moduleFiles: [
                  {
                    type: 'controller',
                    path:
                      modulePath +
                      '/api/http/controllers' +
                      `/${moduleName}-controller.ts`
                  }
                ]
              },
              dtos: {
                path: modulePath + '/api/http/dtos',
                featureFiles: [
                  {
                    type: 'dto',
                    path:
                      modulePath + '/api/http/dtos' + `/${featureName}-dto.ts`
                  }
                ]
              },
              responses: {
                path: modulePath + '/api/http/responses',
                featureFiles: [
                  {
                    type: 'response',
                    path:
                      modulePath +
                      '/api/http/responses' +
                      `/${featureName}-response.ts`
                  }
                ]
              }
            }
          }
        }
      },
      enum: {
        path: modulePath + '/enum',
        moduleFiles: [
          {
            type: 'error-code',
            path: modulePath + '/enum' + `/error-code.ts`
          }
        ]
      },
      models: {
        path: modulePath + '/models',
        moduleFiles: [
          {
            type: 'model',
            path: modulePath + '/models' + `/${moduleName}-model.ts`
          }
        ]
      },
      entities: {
        path: modulePath + '/entities',
        moduleFiles: [
          {
            type: 'entity',
            path: modulePath + '/entities' + `/${moduleName}-entity.ts`
          }
        ]
      },
      'use-case': {
        path: modulePath + '/use-case',
        featureFiles: [
          {
            type: 'use-case',
            path: modulePath + '/use-case' + `/${featureName}-use-case.ts`
          }
        ]
      }
    },
    moduleFiles: [
      { type: 'module', path: `${modulePath}/${moduleName}-module.ts` },
      {
        type: 'shared-service',
        path: `${modulePath}/${moduleName}-shared-service.ts`
      }
    ]
  };
}
