import { ComponentResource } from './type';

const r3: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-r3',
    items: [
      // {
      //   componentType: 'SmText',
      //   path: 'test-in-r3',
      //   params: {
      //     textValue: {
      //       const: {
      //         constValue: 'ABC123mmm',
      //       },
      //     },
      //   },
      // },
      {
        componentType: 'SmText',
        path: 'ref-to-selected-entity-name',
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'This is a constant',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'ref-to-selected-entity-name',
        params: {
          textValue: {
            ruleType: 'refToLocalContext',
            path: '/layout-content',
            sourceParameterKey: 'sid99',
          },
        },
        // parameterDefinitions: [
        //   {
        //     parameterKey: 'ridInPageContext',
        //     target: {
        //       targetType: 'specificLocalContextPath',
        //       targetPath: '/layout-menutop',
        //     },
        //     definition: {
        //       ruleType: 'refToLocalContext',
        //       path: '/layout-content',
        //       sourceParameterKey: 'sid99',
        //     },
        //   },
        // ],
      },
      {
        componentType: 'SmInput',
        path: 'vsm3',
        params: {
          outputParameterKey: 'myInputContent',
          defaultValue: {
            ruleType: 'constant',
            constValue: 'aaa1',
          },
        },
      },
      // {
      //   componentType: 'verticalPanel',
      //   path: 'vpc',
      //   items: [
      //     {
      //       componentType: 'SmText',
      //       path: 'vsm2',
      //       col: 4,
      //       params: {
      //         textValue: {
      //           const: {
      //             constValue: 'Campagne',
      //           },
      //         },
      //       },
      //     },
      //     {
      //       componentType: 'SmInput',
      //       path: 'campaignId',
      //       col: 8,
      //       params: {
      //         defaultValue: {
      //           const: '2023',
      //         },
      //       },
      //     },
      //   ],
      // },
      {
        componentType: 'siteList',
        path: 'vsmsiteList',
        col: 8,
        params: {
          selectedSiteKeyInLocalContext: 'sid99',
        },
      },
      {
        componentType: 'verticalPanel',
        path: 'vp12',
        col: 4,
        display: {
          valueExists: {
            ruleType: 'refToLocalContext',
            path: '/layout-content',
            sourceParameterKey: 'sid99',
          },
        },

        border: true,
        items: [
          {
            componentType: 'SmRefToResource',
            path: 'ref-to-r5',
            col: 12,
            params: {
              resourceId: 'r5',
            },
            parameterDefinitions: [
              {
                target: {
                  parameterKey: 'const1',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'constant',
                  constValue: 'aaa111',
                },
              },
              // {
              //   parameterKey: 'site2',
              //   definition: {
              //     ruleType: 'refToPageContext',
              //     path: '/layout-content',
              //     sourceParameterKey: 'sid',
              //   },
              // },
              {
                target: {
                  parameterKey: 'siteIdFromSiteList',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToLocalContext',
                  path: '/layout-content',
                  sourceParameterKey: 'sid99',
                },
              },
              {
                target: {
                  parameterKey: 'theoutputFromInput',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToLocalContext',
                  path: '/layout-content',
                  sourceParameterKey: 'myInputContent',
                },
              },
              {
                target: {
                  parameterKey: 'thesite44',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToSite',
                  sourceSiteId: {
                    ruleType: 'refToLocalContext',
                    path: '/layout-content',
                    sourceParameterKey: 'myInputContent',
                  },
                },
              },
              {
                target: {
                  parameterKey: 'thesiteFromTheList',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToSite',
                  sourceSiteId: {
                    ruleType: 'refToLocalContext',
                    path: '/layout-content',
                    sourceParameterKey: 'sid99',
                  },
                },
              },
            ],
          },
          {
            componentType: 'SmAttRef',
            path: 'attRefToConso',
            col: 6,
            params: {
              resourceId: {
                ruleType: 'refToLocalContext',
                path: '/layout-content',
                sourceParameterKey: 'sid99',
              },
              campaignId: {
                ruleType: 'constant',
                constValue: '2023',
              },
              attConfig: {
                ruleType: 'constant',
                constValue: 'toConso',
              },
            },
          },

          {
            componentType: 'SmRefToResource',
            path: 'ref-to-fform',
            col: 12,

            params: {
              resourceId: 'rform',
            },
            parameterDefinitions: [
              // {
              //   parameterKey: 'siteIdFromSiteList',
              //   target: {
              //     targetType: 'currentLocalContextPath',
              //   },
              //   definition: {
              //     ruleType: 'refToLocalContext',
              //     path: '/layout-content',
              //     sourceParameterKey: 'sid99',
              //   },
              // },
              // {
              //   parameterKey: 'thesiteFromTheList',
              //   target: {
              //     targetType: 'childLocalContextPath',
              //   },
              //   definition: {
              //     ruleType: 'refToSite',
              //     sourceSiteId: {
              //       ruleType: 'refToLocalContext',
              //       path: '/layout-content',
              //       sourceParameterKey: 'sid99',
              //     },
              //   },
              // },
            ],
          },
        ],
      },
      {
        componentType: 'SmText',
        path: 'vp13',
        col: 4,
        display: {
          valueDoesNotExist: {
            ruleType: 'refToLocalContext',
            path: '/layout-content',
            sourceParameterKey: 'sid99',
          },
        },
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'Select a site...',
          },
        },
      },

      // {
      //   componentType: 'SmRefToResource',
      //   path: 'vsm44form',
      //   params: {
      //     resourceId: 'rform',
      //     arguments: {
      //       selectedResource: {
      //         refToPath: '/pag/vp8/vp/vsmsiteList',
      //         property: 'selected',
      //       },
      //     },
      //   },
      // },
      // {
      //   componentType: 'SmRefToResource',
      //   path: 'vsm4',
      //   params: {
      //     resourceId: 'r4',
      //   },
      // },
    ],
  },
};
const r4 = {
  //   content: {
  //     componentType: 'verticalPanel',
  //     path: 'vp2',
  //     border: true,
  //     items: [
  //       {
  //         componentType: 'SmText',
  //         path: 'vsm5',
  //         col: 4,
  //         params: {
  //           input: {
  //             const: '765675756',
  //           },
  //         },
  //       },
  //       {
  //         componentType: 'SmText',
  //         path: 'vsm6',
  //         col: 3,
  //         params: {
  //           input: {
  //             refToPath: '/vp/vsm3',
  //           },
  //         },
  //       },
  //       {
  //         componentType: 'SmText',
  //         path: 'vsm66',
  //         params: {
  //           input: {
  //             refToPath: '/vp/vsm4/vp2/vsm7',
  //           },
  //         },
  //       },
  //       {
  //         componentType: 'SmText',
  //         path: 'vsm9',
  //         params: {
  //           input: {
  //             refToPath: '../vsm7',
  //           },
  //         },
  //       },
  //       {
  //         componentType: 'SmInput',
  //         path: 'vsm7',
  //         params: {
  //           defaultValue: {
  //             const: 'DEFEDF',
  //           },
  //         },
  //       },
  //     ],
  //   },
};
const r5: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-r5',
    border: true,
    items: [
      // {
      //   componentType: 'SmText',
      //   path: 'vsm55',
      //   params: {
      //     textValue: {
      //       or: [
      //         {
      //           refToPath: {
      //             path: '../..',
      //             property: 'toto',
      //           },
      //         },
      //         {
      //           refToContext: {
      //             property: 'tata',
      //           },
      //         },
      //       ],
      //     },
      //   },
      // },
      // {
      //   componentType: 'SmText',
      //   path: 'vsm99',
      //   params: {
      //     textValue: {
      //       refToPath: {
      //         path: '../..',
      //         property: 'tata',
      //       },
      //     },
      //   },
      // },
      // {
      //   componentType: 'SmText',
      //   path: 'vsm1000',
      //   params: {
      //     textValue: {
      //       refToContext: {
      //         property: 'tata',
      //       },
      //     },
      //   },
      // },
      // {
      //   componentType: 'SmText',
      //   path: 'ref-to-local-siteName',
      //   params: {
      //     textValue: {
      //       refToLocalContext: {
      //         parameterKey: 'site1',
      //         property: 'name',
      //       },
      //     },
      //   },
      // },
      {
        componentType: 'SmText',
        path: 't1-valueExists',
        display: {
          valueExists: {
            ruleType: 'constant',
            constValue: 'a',
          },
        },
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'Displayed if valueExists',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 't2-valueDoesNotExist',
        display: {
          valueDoesNotExist: {
            ruleType: 'constant',
            constValue: 'a',
          },
        },
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'Displayed if valueDoesNotExist',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'ref-to-theoutputFromInput',
        params: {
          textValue: {
            ruleType: 'refToLocalContext',
            path: '/layout-content/ref-to-r5',
            sourceParameterKey: 'theoutputFromInput',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'ref-to-thesite44',
        params: {
          textValue: {
            ruleType: 'refToLocalContext',
            path: '..',
            sourceParameterKey: 'thesite44',
            sourceParameterProperty: 'parent.id',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'ref-to-thesite',
        params: {
          textValue: {
            ruleType: 'refToLocalContext',
            path: '..',
            sourceParameterKey: 'thesiteFromTheList',
            sourceParameterProperty: 'parent.id',
          },
        },
      },

      // {
      //   componentType: 'SmText',
      //   path: 'ref-to-tata',
      //   params: {
      //     textValue: {
      //       refToLocalContext: {
      //         parameterKey: 'theoutputFromInput',
      //       },
      //     },
      //   },
      // },
      // {
      //   componentType: 'SmSiteRef',
      //   path: 'vsm8800',
      //   params: {
      //     siteValue: {
      //       refToPath: {
      //         path: '../..',
      //         property: 'selectedResource',
      //       },
      //     },
      //   },
      // },
      // {
      //   componentType: 'SmText',
      //   path: 'aaaa',
      //   col: 6,
      //   params: {
      //     textValue: {
      //       const: {
      //         constValue: 'To site',
      //       },
      //     },
      //   },
      // },
      // {
      //   componentType: 'SmAttRef',
      //   path: 'attRefToSite',
      //   col: 6,
      //   params: {
      //     resourceId: {
      //       refToPath: {
      //         path: '../..',
      //         property: 'selectedResource.entity.id',
      //       },
      //     },
      //     campaignId: {
      //       refToPath: {
      //         path: '/pag/vp8/vp/vpc/campaignId',
      //       },
      //     },
      //     attConfig: {
      //       const: {
      //         constValue: 'toSite',
      //       },
      //     },
      //   },
      // },
      // {
      //   componentType: 'SmText',
      //   path: 'aaaa',
      //   col: 6,
      //   params: {
      //     textValue: {
      //       const: {
      //         constValue: 'To Consolidé',
      //       },
      //     },
      //   },
      // },
      // {
      //   componentType: 'SmAttRef',
      //   path: 'attRefToConso',
      //   col: 6,
      //   params: {
      //     resourceId: {
      //       refToPath: {
      //         path: '../..',
      //         property: 'selectedResource.entity.id',
      //       },
      //     },
      //     campaignId: {
      //       const: {
      //         constValue: '2023',
      //       },
      //     },
      //     attConfig: {
      //       const: {
      //         constValue: 'toConso',
      //       },
      //     },
      //   },
      // },
      // {
      //   componentType: 'SmAttRef',
      //   path: 'attRefToFixed',
      //   col: 6,
      //   params: {
      //     resourceId: {
      //       const: {
      //         constValue: 'root',
      //       },
      //     },
      //     campaignId: {
      //       const: {
      //         constValue: '2023',
      //       },
      //     },
      //     attConfig: {
      //       const: {
      //         constValue: 'toConso',
      //       },
      //     },
      //   },
      // },
    ],
  },
  parameters: [
    {
      parameterKey: 'myConst',
      definition: {
        ruleType: 'constant',
        constValue: 'bbbccc',
      },
    },
  ],
};

const siteDetail: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-rds-sitedetail',
    border: true,
    items: [
      {
        componentType: 'SmText',
        path: 'const',
        params: {
          textValue: {
            ruleType: 'itemParamProperty',
            propertyDefinition: {
              type: 'ID',
            },
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'const',
        params: {
          textValue: {
            ruleType: 'itemParamProperty',
            propertyDefinition: {
              type: 'NAME',
            },
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'const',
        params: {
          textValue: {
            ruleType: 'itemParamProperty',
            propertyDefinition: {
              type: 'ATTRIBUTE',
              attributeConfigId: 'toSite',
              campaignId: '2023',
            },
          },
        },
      },
    ],
  },
};

const rDsList: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-rds-list',
    border: true,
    items: [
      {
        componentType: 'SmText',
        path: 'const',
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'Exemple de Datalist',
          },
        },
        parameterDefinitions: [
          {
            target: {
              parameterKey: 'myds',
              targetType: 'currentLocalContextPath',
            },
            definition: {
              ruleType: 'dataset',
              columnDefinitions: [
                { columnType: 'ID' },
                { columnType: 'NAME' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'toSite', campaignId: '2023' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'toConso', campaignId: '2023' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'isCert', campaignId: '2023' },
                { columnType: 'BUTTON', action: 'select' },
              ],
              // filter: {
              //   ruleType: 'refToLocalContext',
              //   path: '',
              //   sourceParameterKey: 'theFilter',
              // },
              initialPaginationState: {
                activePage: 1,
                itemsPerPage: 5,
                sort: 'id',
                order: 'asc',
              },
              valueFilter: {
                filterType: 'AND',
                items: [],
              },
            },
          },
        ],
      },
      {
        componentType: 'dataSetList',
        path: 'dataset33',
        params: {
          data: {
            ruleType: 'refToLocalContext',
            path: '',
            sourceParameterKey: 'myds',
          },
        },
      },
    ],
  },
};

const rDtTree: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-rdt-tree',
    border: true,
    items: [
      {
        componentType: 'SmText',
        path: 'const',
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'Exemple de Datatree',
          },
        },
        parameterDefinitions: [
          {
            target: {
              parameterKey: 'mydt',
              targetType: 'currentLocalContextPath',
            },
            definition: {
              ruleType: 'datatree',
              columnDefinitions: [
                { columnType: 'ID' },
                { columnType: 'NAME' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'toSite', campaignId: '2023' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'toConso', campaignId: '2023' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'isCert', campaignId: '2023' },
                { columnType: 'BUTTON', action: 'select' },
              ],
              // filter: {
              //   ruleType: 'refToLocalContext',
              //   path: '',
              //   sourceParameterKey: 'theFilter',
              // },
              initialPaginationState: {
                activePage: 1,
                itemsPerPage: 5,
                sort: 'id',
                order: 'asc',
              },
              valueFilter: {
                filterType: 'AND',
                items: [],
              },
            },
          },
        ],
      },
      {
        componentType: 'dataSetTree',
        path: 'datasettree',
        params: {
          data: {
            ruleType: 'refToLocalContext',
            path: '',
            sourceParameterKey: 'mydt',
          },
        },
      },
    ],
  },
};

const rDsWithForm: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-rds-with-form',
    border: true,
    items: [
      {
        componentType: 'verticalPanel',
        path: 'vp-rds-with-form',
        border: true,
        col: 8,
        items: [
          {
            componentType: 'SmText',
            path: 'ref-to-selected-entity-name',
            params: {
              textValue: {
                ruleType: 'refToLocalContext',
                path: '/layout-content',
                sourceParameterKey: 'sid98',
              },
            },
          },
          {
            componentType: 'SmInput',
            path: 'vsm3d',
            params: {
              outputParameterKey: 'theTerm',
              defaultValue: {
                ruleType: 'constant',
                constValue: 'S1',
              },
            },
          },
          {
            componentType: 'SmText',
            path: 'dataset',
            params: {
              textValue: {
                ruleType: 'constant',
                constValue: 'The dataset WITH FORM',
              },
            },
            parameterDefinitions: [
              {
                target: {
                  parameterKey: 'theTerm2',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'constant',
                  constValue: 'S1',
                },
              },
              {
                target: {
                  parameterKey: 'myds',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'dataset',
                  columnDefinitions: [
                    { columnType: 'ID' },
                    { columnType: 'NAME' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'toSite', campaignId: '2023' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'toConso', campaignId: '2023' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'isCert', campaignId: '2023' },
                    { columnType: 'BUTTON', action: 'select' },
                  ],
                  // filter: {
                  //   ruleType: 'refToLocalContext',
                  //   path: '',
                  //   sourceParameterKey: 'theFilter',
                  // },
                  initialPaginationState: {
                    activePage: 1,
                    itemsPerPage: 5,
                    sort: 'id',
                    order: 'asc',
                  },
                  valueFilter: {
                    filterType: 'AND',
                    items: [
                      {
                        filterType: 'PROPERTY_FILTER',
                        property: {
                          filterPropertyType: 'RESOURCE_PROPERTY',
                          property: 'name',
                        },
                        filterRule: {
                          filterRuleType: 'TEXT_CONTAINS',
                          terms: {
                            ruleType: 'refToLocalContext',
                            path: '',
                            sourceParameterKey: 'theTerm',
                          },
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
          {
            componentType: 'dataSetTable',
            path: 'dataset22',
            params: {
              columnDefinitions: [
                { columnType: 'ATTRIBUTE', attributeConfigId: 'isCert', campaignId: '2023' },
                { columnType: 'ID' },
                { columnType: 'NAME' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'toSite', campaignId: '2023' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'toConso', campaignId: '2023' },
                { columnType: 'BUTTON', action: 'select' },
              ],
              data: {
                ruleType: 'refToLocalContext',
                path: '',
                sourceParameterKey: 'myds',
              },
              selectedSiteKeyInLocalContext: 'sid98',
            },
          },
        ],
      },
      {
        componentType: 'verticalPanel',
        path: 'vp-rds-with-form-right',
        border: true,
        col: 4,
        display: {
          valueExists: {
            ruleType: 'refToLocalContext',
            path: '/layout-content',
            sourceParameterKey: 'sid98',
          },
        },

        items: [
          {
            componentType: 'SmRefToResource',
            path: 'ref-to-r5',
            col: 12,
            params: {
              resourceId: 'r5',
            },
            parameterDefinitions: [
              {
                target: {
                  parameterKey: 'const1',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'constant',
                  constValue: 'aaa111',
                },
              },
              // {
              //   parameterKey: 'site2',
              //   definition: {
              //     ruleType: 'refToPageContext',
              //     path: '/layout-content',
              //     sourceParameterKey: 'sid',
              //   },
              // },
              {
                target: {
                  parameterKey: 'siteIdFromSiteList',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToLocalContext',
                  path: '/layout-content',
                  sourceParameterKey: 'sid98',
                },
              },
              {
                target: {
                  parameterKey: 'theoutputFromInput',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToLocalContext',
                  path: '/layout-content',
                  sourceParameterKey: 'myInputContent',
                },
              },
              {
                target: {
                  parameterKey: 'thesite44',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToSite',
                  sourceSiteId: {
                    ruleType: 'refToLocalContext',
                    path: '/layout-content',
                    sourceParameterKey: 'myInputContent',
                  },
                },
              },
              {
                target: {
                  parameterKey: 'thesiteFromTheList',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToSite',
                  sourceSiteId: {
                    ruleType: 'refToLocalContext',
                    path: '/layout-content',
                    sourceParameterKey: 'sid98',
                  },
                },
              },
            ],
          },
          {
            componentType: 'SmAttRef',
            path: 'attRefToConso',
            col: 6,
            params: {
              resourceId: {
                ruleType: 'refToLocalContext',
                path: '/layout-content',
                sourceParameterKey: 'sid98',
              },
              campaignId: {
                ruleType: 'constant',
                constValue: '2023',
              },
              attConfig: {
                ruleType: 'constant',
                constValue: 'toConso',
              },
            },
          },

          {
            componentType: 'SmRefToResource',
            path: 'ref-to-fform',
            col: 12,

            params: {
              resourceId: 'rform',
            },
            parameterDefinitions: [
              // {
              //   parameterKey: 'siteIdFromSiteList',
              //   target: {
              //     targetType: 'currentLocalContextPath',
              //   },
              //   definition: {
              //     ruleType: 'refToLocalContext',
              //     path: '/layout-content',
              //     sourceParameterKey: 'sid98',
              //   },
              // },
              // {
              //   parameterKey: 'thesiteFromTheListzzzzzz',
              //   target: {
              //     targetType: 'childLocalContextPath',
              //   },
              //   definition: {
              //     ruleType: 'refToSite',
              //     sourceSiteId: {
              //       ruleType: 'refToLocalContext',
              //       path: '/layout-content',
              //       sourceParameterKey: 'sid98',
              //     },
              //   },
              // },
            ],
          },
        ],
      },
      {
        componentType: 'SmText',
        path: 'vp13',
        col: 4,
        display: {
          valueDoesNotExist: {
            ruleType: 'refToLocalContext',
            path: '/layout-content',
            sourceParameterKey: 'sid98',
          },
        },
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'Select a site here...',
          },
        },
      },
    ],
  },
};

const rds: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-rds',
    border: true,
    items: [
      {
        componentType: 'SmInput',
        path: 'vsm3d',
        params: {
          outputParameterKey: 'theTerm',
          defaultValue: {
            ruleType: 'constant',
            constValue: 'S1',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'dataset',
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'The dataset',
          },
        },
        parameterDefinitions: [
          {
            target: {
              parameterKey: 'theTerm2',
              targetType: 'currentLocalContextPath',
            },
            definition: {
              ruleType: 'constant',
              constValue: 'S1',
            },
          },
          {
            target: {
              parameterKey: 'myds',
              targetType: 'currentLocalContextPath',
            },
            definition: {
              ruleType: 'dataset',
              columnDefinitions: [
                { columnType: 'ID' },
                { columnType: 'NAME' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'toSite', campaignId: '2023' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'toConso', campaignId: '2023' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'isCert', campaignId: '2023' },
                { columnType: 'BUTTON', action: 'select' },
              ],
              // filter: {
              //   ruleType: 'refToLocalContext',
              //   path: '',
              //   sourceParameterKey: 'theFilter',
              // },
              initialPaginationState: {
                activePage: 1,
                itemsPerPage: 5,
                sort: 'id',
                order: 'asc',
              },
              valueFilter: {
                filterType: 'AND',
                items: [
                  {
                    filterType: 'PROPERTY_FILTER',
                    property: {
                      filterPropertyType: 'RESOURCE_PROPERTY',
                      property: 'name',
                    },
                    filterRule: {
                      filterRuleType: 'TEXT_CONTAINS',
                      terms: {
                        ruleType: 'refToLocalContext',
                        path: '',
                        sourceParameterKey: 'theTerm',
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
      {
        componentType: 'dataSetTable',
        path: 'dataset22',
        params: {
          columnDefinitions: [
            { columnType: 'ATTRIBUTE', attributeConfigId: 'isCert', campaignId: '2023' },
            { columnType: 'ID' },
            { columnType: 'NAME' },
            { columnType: 'ATTRIBUTE', attributeConfigId: 'toSite', campaignId: '2023' },
            { columnType: 'ATTRIBUTE', attributeConfigId: 'toConso', campaignId: '2023' },
            { columnType: 'BUTTON', action: 'select' },
          ],
          data: {
            ruleType: 'refToLocalContext',
            path: '',
            sourceParameterKey: 'myds',
          },
          // paginationState: {
          //   ruleType: 'refToLocalContext',
          //   path: '',
          //   sourceParameterKey: 'thePaginationState',
          // },
        },
      },
    ],
  },
  parameters: [],
};

const rform: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp12',
    border: true,
    items: [
      // {
      //   componentType: 'SmText',
      //   path: 'ref-to-thesite',
      //   params: {
      //     textValue: {
      //       ruleType: 'refToLocalContext',
      //       path: '..',
      //       sourceParameterKey: 'thesiteFromTheList',
      //       sourceParameterProperty: 'name',
      //     },
      //   },
      // },
      {
        componentType: 'Form',
        path: 'vsmform',
        params: {
          attributeContext: {
            resourceId: {
              ruleType: 'refToLocalContext',
              path: '..',
              sourceParameterKey: 'thesiteFromTheList',
              sourceParameterProperty: 'id',
            },
            campaignId: {
              ruleType: 'constant',
              constValue: '2023',
            },
          },
          fields: [
            {
              fieldType: 'Field',
              fieldId: 'theToSite',
              attributeConfigId: 'toSite',
              campaignId: {
                useCurrent: true,
              },
            },
            {
              fieldType: 'Field',
              fieldId: 'theToConso',
              attributeConfigId: 'toConso',
              campaignId: {
                useCurrent: true,
              },
            },
            {
              fieldType: 'Field',
              fieldId: 'theToCert',
              attributeConfigId: 'isCert',
              campaignId: {
                useCurrent: true,
              },
            },
          ],
          formContent: {
            componentType: 'verticalPanel',
            path: 'vp88',
            items: [
              {
                componentType: 'SmText',
                path: 'resName',
                params: {
                  textValue: {
                    ruleType: 'refToLocalContext',
                    path: '..',
                    sourceParameterKey: 'thesiteFromTheList',
                    sourceParameterProperty: 'name',
                  },
                },
              },
              {
                componentType: 'AttributeField',
                path: 'vsmatt',
                fieldId: 'theToSite',
              },
              {
                componentType: 'AttributeField',
                path: 'vsmattbool',
                fieldId: 'theToCert',
              },
              {
                componentType: 'AttributeField',
                path: 'vsmattconso',
                fieldId: 'theToConso',
              },
            ],
          },
        },
      },
    ],
  },
};

const rmenuTop: ComponentResource = {
  content: {
    componentType: 'menu',
    path: 'menu',
    params: {
      menuItems: [
        {
          label: 'Page 1',
          path: 'p1',
          pageId: 'rpage1',
        },
        {
          label: 'Page 2',
          path: 'p2',
          pageId: 'rpage2',
        },
      ],
    },
  },
};
const rlayout: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-layout',
    items: [
      {
        componentType: 'layoutElement',
        path: 'layout-menutop',
        params: {
          layoutElementId: 'menuTop',
        },
      },
      {
        componentType: 'SmAttRef',
        path: 'attRefToConso',
        col: 6,
        params: {
          resourceId: {
            ruleType: 'constant',
            constValue: 'root',
          },
          campaignId: {
            ruleType: 'constant',
            constValue: '2023',
          },
          attConfig: {
            ruleType: 'constant',
            constValue: 'toConso',
          },
        },
      },

      {
        componentType: 'layoutElement',
        path: 'layout-content',
        params: {
          layoutElementId: 'theContent',
        },
      },
    ],
  },
};

const rpage1: ComponentResource = {
  content: {
    componentType: 'page',
    path: 'pag-1',
    params: {
      layoutResourceId: 'rlayout',
      layoutElements: [
        {
          layoutElementId: 'menuTop',
          resourceId: 'rmenuTop',
        },
        {
          layoutElementId: 'theContent',
          resourceId: 'r3',
        },
      ],
    },
  },
  // parameters: [
  //   {
  //     parameterKey: 'sid-notused',
  //     parameterType: 'string',
  //   },
  //   {
  //     parameterKey: 'category',
  //     parameterType: 'string',
  //   },
  // ],
};

const rpage2: ComponentResource = {
  content: {
    componentType: 'page',
    path: 'page-2',
    params: {
      layoutResourceId: 'rlayout',
      layoutElements: [
        {
          layoutElementId: 'menuTop',
          resourceId: 'rmenuTop',
        },
        {
          layoutElementId: 'theContent',
          resourceId: 'r5',
        },
      ],
    },
    parameterDefinitions: [
      {
        target: {
          parameterKey: 'mmmiii',
          targetType: 'specificLocalContextPath',
          targetPath: '/layout-menutop',
        },
        definition: {
          ruleType: 'refToLocalContext',
          path: '/layout-content',
          sourceParameterKey: 'sid99',
        },
      },
    ],
  },
  // parameters: [
  //   {
  //     parameterKey: 'sid',
  //     parameterType: 'string',
  //   },
  //   {
  //     parameterKey: 'category',
  //     parameterType: 'string',
  //   },
  // ],
};

const rpageDs: ComponentResource = {
  content: {
    componentType: 'page',
    path: 'page-ds',
    params: {
      layoutResourceId: 'rlayout',
      layoutElements: [
        {
          layoutElementId: 'menuTop',
          resourceId: 'rmenuTop',
        },
        {
          layoutElementId: 'theContent',
          resourceId: 'rds',
        },
      ],
    },
  },
  parameters: [],
};

const rpageDsWithForm: ComponentResource = {
  content: {
    componentType: 'page',
    path: 'page-ds',
    params: {
      layoutResourceId: 'rlayout',
      layoutElements: [
        {
          layoutElementId: 'menuTop',
          resourceId: 'rmenuTop',
        },
        {
          layoutElementId: 'theContent',
          resourceId: 'rDsWithForm',
        },
      ],
    },
  },
  parameters: [],
};

const rpageDsList: ComponentResource = {
  content: {
    componentType: 'page',
    path: 'page-ds',
    params: {
      layoutResourceId: 'rlayout',
      layoutElements: [
        {
          layoutElementId: 'menuTop',
          resourceId: 'rmenuTop',
        },
        {
          layoutElementId: 'theContent',
          resourceId: 'rDsList',
        },
      ],
    },
  },
  parameters: [],
};

const rpageDtTree: ComponentResource = {
  content: {
    componentType: 'page',
    path: 'page-dt',
    params: {
      layoutResourceId: 'rlayout',
      layoutElements: [
        {
          layoutElementId: 'menuTop',
          resourceId: 'rmenuTop',
        },
        {
          layoutElementId: 'theContent',
          resourceId: 'rDtTree',
        },
      ],
    },
  },
  parameters: [],
};

export const stubbedResources = {
  r3,
  r4,
  r5,
  siteDetail,
  rmenuTop,
  rlayout,
  rpage1,
  rpage2,
  rform,
  rds,
  rDsWithForm,
  rDsList,
  rDtTree,
  rpageDs,
  rpageDsWithForm,
  rpageDsList,
  rpageDtTree,
};
