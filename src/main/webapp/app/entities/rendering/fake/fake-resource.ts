import { ComponentResource } from '../type';
import r3html from './r3.html';
import page3html from './page3.html';
import page4html from './page4.html';
import pageDstreeHtml from './pageDstree.html';
import topMenuHtml from './topMenu.html';
import smallMenuHtml from './smallMenu.html';
import mylayoutHtml from './mylayoutHtml.html';
import myformHtml from './myform.html';
import page7Html from './page7.html';
import page6Html from './page6.html';

const r3: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-r3',
    items: [
      {
        componentType: 'SmMarkup',
        path: 'ref-to-selected-entity-name',
        params: {
          markup: r3html,
          itemMap: {
            a: {
              componentType: 'SmText',
              path: 'ref-to-selected-entity-name',
              params: {
                textValue: {
                  ruleType: 'constant',
                  constValue: 'This is a AA',
                },
              },
            },
            b: {
              componentType: 'SmText',
              path: 'ref-to-selected-entity-name',
              params: {
                textValue: {
                  ruleType: 'refToLocalContext',
                  path: '/layout-content',
                  sourceParameterKey: 'theInput',
                },
              },
            },
            input: {
              componentType: 'SmInput',
              path: 'vsm3',
              params: {
                outputParameterKey: 'theInput',
                defaultValue: {
                  ruleType: 'constant',
                  constValue: 'aaa122',
                },
              },
            },
            c: {
              componentType: 'SmRefToResource',
              path: 'reftosubdetail',
              col: 12,
              params: {
                resourceId: 'subdetail',
              },
            },
            topMenu: {
              componentType: 'SmRefToResource',
              path: 'tpmenu',
              col: 12,
              params: {
                resourceId: 'topMenu',
              },
            },
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
        componentType: 'resourceList',
        path: 'vsmresourceList',
        col: 8,
        params: {
          selectedResourceKeyInLocalContext: 'sid99',
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
              //   parameterKey: 'resource2',
              //   definition: {
              //     ruleType: 'refToPageContext',
              //     path: '/layout-content',
              //     sourceParameterKey: 'sid',
              //   },
              // },
              {
                target: {
                  parameterKey: 'resourceIdFromResourceList',
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
                  parameterKey: 'theresource44',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToResource',
                  sourceResourceId: {
                    ruleType: 'refToLocalContext',
                    path: '/layout-content',
                    sourceParameterKey: 'myInputContent',
                  },
                },
              },
              {
                target: {
                  parameterKey: 'theresourceFromTheList',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToResource',
                  sourceResourceId: {
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
              //   parameterKey: 'resourceIdFromResourceList',
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
              //   parameterKey: 'theresourceFromTheList',
              //   target: {
              //     targetType: 'childLocalContextPath',
              //   },
              //   definition: {
              //     ruleType: 'refToResource',
              //     sourceResourceId: {
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
            constValue: 'Select a resource...',
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
      //         refToPath: '/pag/vp8/vp/vsmresourceList',
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

const page3: ComponentResource = {
  content: {
    componentType: 'SmMarkup',
    path: 'page3',
    params: {
      markup: page3html,
      itemMap: {
        a: {
          componentType: 'SmText',
          path: 'ref-to-selected-entity-name',
          params: {
            textValue: {
              ruleType: 'constant',
              constValue: 'This is a AA',
            },
          },
        },
        b: {
          componentType: 'SmText',
          path: 'ref-to-selected-entity-name',
          params: {
            textValue: {
              ruleType: 'refToLocalContext',
              path: '/',
              sourceParameterKey: 'theInput',
            },
          },
        },
        input: {
          componentType: 'SmInput',
          path: 'vsm3',
          params: {
            outputParameterKey: 'theInput',
            defaultValue: {
              ruleType: 'constant',
              constValue: 'aaa122',
            },
          },
        },
        c: {
          componentType: 'SmRefToResource',
          path: 'reftosubdetail',
          col: 12,
          params: {
            resourceId: 'subdetail',
          },
        },
        topMenu: {
          componentType: 'SmRefToResource',
          path: 'tpmenu',
          col: 12,
          params: {
            resourceId: 'topMenu',
          },
        },
      },
    },
  },
};

const page4: ComponentResource = {
  content: {
    componentType: 'SmMarkup',
    path: 'page4',
    params: {
      markup: page4html,
      itemMap: {
        a: {
          componentType: 'SmText',
          path: 'ref-to-selected-entity-name',
          params: {
            textValue: {
              ruleType: 'constant',
              constValue: 'This is a AA',
            },
          },
        },
        b: {
          componentType: 'SmText',
          path: 'ref-to-selected-entity-name',
          params: {
            textValue: {
              ruleType: 'refToLocalContext',
              path: '',
              sourceParameterKey: 'theInput',
            },
          },
        },
        input: {
          componentType: 'SmInput',
          path: 'vsm3',
          params: {
            outputParameterKey: 'theInput',
            defaultValue: {
              ruleType: 'constant',
              constValue: 'aaa122',
            },
          },
        },
        c: {
          componentType: 'SmRefToResource',
          path: 'reftosubdetail',
          col: 12,
          params: {
            resourceId: 'subdetail',
          },
        },
        topMenu: {
          componentType: 'SmRefToResource',
          path: 'tpmenu',
          col: 12,
          params: {
            resourceId: 'topMenu',
          },
        },
      },
    },
  },
};

const page5: ComponentResource = {
  content: {
    componentType: 'SmLayout',
    path: 'page5',
    params: {
      layoutId: 'mylayout',
      itemMap: {
        content: {
          componentType: 'SmMarkup',
          path: 'pageDstree',
          params: {
            markup: pageDstreeHtml,
            itemMap: {
              a: {
                componentType: 'SmText',
                path: 'ref-to-selected-entity-name',
                params: {
                  textValue: {
                    ruleType: 'constant',
                    constValue: 'This is a AA',
                  },
                },
              },
              b: {
                componentType: 'SmText',
                path: 'ref-to-selected-entity-name',
                params: {
                  textValue: {
                    ruleType: 'refToLocalContext',
                    path: '',
                    sourceParameterKey: 'sid98',
                  },
                },
              },
              r5detail: {
                componentType: 'SmRefToResource',
                path: 'ref-to-r5',
                col: 12,
                params: {
                  resourceId: 'r5',
                },
                parameterDefinitions: [
                  // {
                  //   target: {
                  //     parameterKey: 'const1',
                  //     targetType: 'currentLocalContextPath',
                  //   },
                  //   definition: {
                  //     ruleType: 'constant',
                  //     constValue: 'aaa111',
                  //   },
                  // },
                  // {
                  //   target: {
                  //     parameterKey: 'resourceIdFromResourceList',
                  //     targetType: 'currentLocalContextPath',
                  //   },
                  //   definition: {
                  //     ruleType: 'refToLocalContext',
                  //     path: '/',
                  //     sourceParameterKey: 'sid91',
                  //   },
                  // },
                  // {
                  //   target: {
                  //     parameterKey: 'theresourceFromTheList',
                  //     targetType: 'currentLocalContextPath',
                  //   },
                  //   definition: {
                  //     ruleType: 'refToResource',
                  //     sourceResourceId: {
                  //       ruleType: 'refToLocalContext',
                  //       path: '/',
                  //       sourceParameterKey: 'sid91',
                  //     },
                  //   },
                  // },
                ],
              },
              att1: {
                componentType: 'SmAttRef',
                path: 'attRefToConso',
                col: 6,
                params: {
                  resourceId: {
                    ruleType: 'refToLocalContext',
                    path: '',
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
              theform: {
                componentType: 'SmRefToResource',
                path: 'ref-to-fform',
                col: 12,

                params: {
                  resourceId: 'myform',
                },
                parameterDefinitions: [
                  // {
                  //   target: {
                  //     parameterKey: 'resourceIdFromResourceList',
                  //     targetType: 'currentLocalContextPath',
                  //   },
                  //   definition: {
                  //     ruleType: 'refToLocalContext',
                  //     path: '/',
                  //     sourceParameterKey: 'sid98',
                  //   },
                  // },
                  // {
                  //   target: {
                  //     parameterKey: 'theresourceFromTheList',
                  //     targetType: 'currentLocalContextPath',
                  //   },
                  //   definition: {
                  //     ruleType: 'refToResource',
                  //     sourceResourceId: {
                  //       ruleType: 'refToLocalContext',
                  //       path: '/',
                  //       sourceParameterKey: 'sid10000',
                  //     },
                  //   },
                  // },
                ],
              },
              aggrid: {
                componentType: 'aggridTree',
                path: 'aggridtree',
                params: {
                  columnDefinitions: [
                    { columnType: 'ID' },
                    { columnType: 'NAME' },
                    { columnType: 'TAGS' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'toSite', campaignId: '2023' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'toConso', campaignId: '2023' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'isCert', campaignId: '2023' },
                    { columnType: 'BUTTON', action: 'edit' },
                    { columnType: 'BUTTON', action: 'addChildren' },
                    { columnType: 'BUTTON', action: 'select' },
                    { columnType: 'BUTTON', action: 'remove' },
                  ],
                  valueFilter: {
                    filterType: 'AND',
                    items: [],
                  },
                  selectedResourceKeyInLocalContext: 'sid91',
                },
              },
            },
          },
        },
      },
    },
  },
};

const myform: ComponentResource = {
  content: {
    componentType: 'form',
    path: 'vsmform',
    params: {
      attributeContext: {
        resourceId: {
          ruleType: 'refToLocalContext',
          path: '..',
          sourceParameterKey: 'theresourceFromTheList',
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
          fieldId: 'theToResource',
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
        componentType: 'SmMarkup',
        path: 'vp88',
        params: {
          markup: myformHtml,
          itemMap: {
            resName: {
              componentType: 'SmText',
              path: 'resName',
              params: {
                textValue: {
                  ruleType: 'refToLocalContext',
                  path: '..',
                  sourceParameterKey: 'theresourceFromTheList',
                  sourceParameterProperty: 'name',
                },
              },
            },
            theToResourceKey: {
              componentType: 'attributeField',
              path: 'vsmatt',
              params: {
                fieldId: 'theToResource',
              },
            },
            theToCertKey: {
              componentType: 'attributeField',
              path: 'vsmattbool',
              params: {
                fieldId: 'theToCert',
              },
            },
            theToConsoKey: {
              componentType: 'attributeField',
              path: 'vsmattconso',
              params: {
                fieldId: 'theToConso',
              },
            },
            submitButton: {
              componentType: 'formButton',
              path: 'formButton',
              params: {
                label: 'Enregister la resource',
                color: 'primary',
              },
            },
          },
        },
      },
    },
  },
};

const page6: ComponentResource = {
  content: {
    componentType: 'SmLayout',
    path: 'page6',
    params: {
      layoutId: 'mylayout',
      itemMap: {
        content: {
          componentType: 'SmMarkup',
          path: 'jjj',
          params: {
            markup: page6Html,
            itemMap: {
              grid: {
                componentType: 'aggridTree',
                path: 'aggridtree',
                params: {
                  columnDefinitions: [
                    { columnType: 'ID' },
                    { columnType: 'NAME' },
                    { columnType: 'TAGS' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'toSite', campaignId: '2023' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'toConso', campaignId: '2023' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'isCert', campaignId: '2023' },
                    { columnType: 'BUTTON', action: 'edit' },
                    { columnType: 'BUTTON', action: 'addChildren' },
                    { columnType: 'BUTTON', action: 'select' },
                    { columnType: 'BUTTON', action: 'remove' },
                  ],
                  valueFilter: {
                    filterType: 'AND',
                    items: [],
                  },
                  selectedResourceKeyInLocalContext: 'sid91',
                },
              },
              detail1: {
                componentType: 'SmText',
                path: 'ref-to-selected-entity-name',
                params: {
                  textValue: {
                    ruleType: 'constant',
                    constValue: 'This is a Detail1',
                  },
                },
              },
              detail2: {
                componentType: 'SmRefToResource',
                path: 'tapmenu',
                col: 12,
                params: {
                  resourceId: 'theDetail',
                },
              },
            },
          },
        },
      },
    },
  },
};

const theDetail: ComponentResource = {
  content: {
    componentType: 'SmText',
    path: 'ref-to-selected-entity-name',
    params: {
      textValue: {
        ruleType: 'constant',
        constValue: 'This is a Detail2',
      },
    },
  },
};

const page7: ComponentResource = {
  content: {
    componentType: 'SmLayout',
    path: 'page7',
    params: {
      layoutId: 'mylayout',
      itemMap: {
        content: {
          componentType: 'SmMarkup',
          path: 'page7',
          params: {
            markup: page7Html,
            itemMap: {
              a: {
                componentType: 'SmInput',
                path: 'totoss1',
                params: {
                  outputParameterKey: 'theTerm',
                  defaultValue: {
                    ruleType: 'constant',
                    constValue: 'S1',
                  },
                },
              },
              b: {
                componentType: 'SmText',
                path: 'totoss2',
                params: {
                  textValue: {
                    ruleType: 'constant',
                    constValue: 'This is a eeeeeeeee B',
                  },
                },
              },
              c: {
                componentType: 'SmText',
                path: 'totoss3',
                params: {
                  textValue: {
                    ruleType: 'refToLocalContext',
                    path: '/content/a',
                    sourceParameterKey: 'theTerm',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const mylayout: ComponentResource = {
  content: {
    componentType: 'SmMarkup',
    path: 'toto',
    params: {
      markup: mylayoutHtml,
      itemMap: {
        top: {
          componentType: 'SmRefToResource',
          path: 'tpmenu',
          col: 12,
          params: {
            resourceId: 'topMenu',
          },
        },
      },
    },
  },
};

const pageDstree: ComponentResource = {
  content: {
    componentType: 'SmLayout',
    path: 'pageDstree',
    params: {
      layoutId: 'mylayout',
      itemMap: {
        content: {
          componentType: 'SmMarkup',
          path: 'pageDstree',
          params: {
            markup: pageDstreeHtml,
            itemMap: {
              a: {
                componentType: 'SmText',
                path: 'ref-to-selected-entity-name',
                params: {
                  textValue: {
                    ruleType: 'constant',
                    constValue: 'This is a AA',
                  },
                },
              },
              b: {
                componentType: 'SmText',
                path: 'ref-to-selected-entity-name',
                params: {
                  textValue: {
                    ruleType: 'refToLocalContext',
                    path: '',
                    sourceParameterKey: 'sid98',
                  },
                },
              },
              r5detail: {
                componentType: 'SmRefToResource',
                path: 'ref-to-r5',
                col: 12,
                params: {
                  resourceId: 'r5',
                },
                parameterDefinitions: [
                  // {
                  //   target: {
                  //     parameterKey: 'const1',
                  //     targetType: 'currentLocalContextPath',
                  //   },
                  //   definition: {
                  //     ruleType: 'constant',
                  //     constValue: 'aaa111',
                  //   },
                  // },
                  // {
                  //   target: {
                  //     parameterKey: 'resourceIdFromResourceList',
                  //     targetType: 'currentLocalContextPath',
                  //   },
                  //   definition: {
                  //     ruleType: 'refToLocalContext',
                  //     path: '/',
                  //     sourceParameterKey: 'sid98',
                  //   },
                  // },
                  // {
                  //   target: {
                  //     parameterKey: 'theresourceFromTheList',
                  //     targetType: 'currentLocalContextPath',
                  //   },
                  //   definition: {
                  //     ruleType: 'refToResource',
                  //     sourceResourceId: {
                  //       ruleType: 'refToLocalContext',
                  //       path: '/',
                  //       sourceParameterKey: 'sid98',
                  //     },
                  //   },
                  // },
                ],
              },
              detail: {
                componentType: 'verticalPanel',
                path: 'vp-rds-with-form-right',
                border: true,
                col: 3,
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
                      {
                        target: {
                          parameterKey: 'resourceIdFromResourceList',
                          targetType: 'currentLocalContextPath',
                        },
                        definition: {
                          ruleType: 'refToLocalContext',
                          path: '/',
                          sourceParameterKey: 'sid98',
                        },
                      },
                      {
                        target: {
                          parameterKey: 'theresourceFromTheList',
                          targetType: 'currentLocalContextPath',
                        },
                        definition: {
                          ruleType: 'refToResource',
                          sourceResourceId: {
                            ruleType: 'refToLocalContext',
                            path: '/',
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
                        path: '',
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
                    parameterDefinitions: [],
                  },
                ],
              },
              aggrid: {
                componentType: 'aggridTree',
                path: 'aggridtree',
                params: {
                  columnDefinitions: [
                    { columnType: 'ID' },
                    { columnType: 'NAME' },
                    { columnType: 'TAGS' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'toSite', campaignId: '2023' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'toConso', campaignId: '2023' },
                    { columnType: 'ATTRIBUTE', attributeConfigId: 'isCert', campaignId: '2023' },
                    { columnType: 'BUTTON', action: 'edit' },
                    { columnType: 'BUTTON', action: 'addChildren' },
                    { columnType: 'BUTTON', action: 'select' },
                    { columnType: 'BUTTON', action: 'remove' },
                  ],
                  valueFilter: {
                    filterType: 'AND',
                    items: [],
                  },
                  selectedResourceKeyInLocalContext: 'sid98',
                },
              },
            },
          },
        },
      },
    },
  },
};

const topMenu: ComponentResource = {
  content: {
    componentType: 'SmMarkup',
    path: 'ref-to-selected-entity-name',
    params: {
      markup: topMenuHtml,
      itemMap: {
        link1: {
          componentType: 'SmLink',
          path: 'link1',
          params: {
            urlLabel: 'rpage1',
            url: '/coca/render/rpage1',
          },
        },
        link2: {
          componentType: 'SmLink',
          path: 'link2',
          params: {
            urlLabel: 'rpage2',
            url: '/coca/render/rpage2',
          },
        },
        link3: {
          componentType: 'SmLink',
          path: 'r3',
          params: {
            urlLabel: 'r3',
            url: '/coca/render/r3',
          },
        },
        page3: {
          componentType: 'SmLink',
          path: 'page3',
          params: {
            urlLabel: 'Page 3',
            url: '/coca/render/page3',
          },
        },
        page4: {
          componentType: 'SmLink',
          path: 'page4',
          params: {
            urlLabel: 'Page 4',
            url: '/coca/render/page4',
          },
        },
        pageDstree: {
          componentType: 'SmLink',
          path: 'pageDstree',
          params: {
            urlLabel: 'Dstree',
            url: '/coca/render/pageDstree',
          },
        },
        page5: {
          componentType: 'SmLink',
          path: 'page5',
          params: {
            urlLabel: 'Page 5',
            url: '/coca/render/page5',
          },
        },
        page6: {
          componentType: 'SmLink',
          path: 'page6',
          params: {
            urlLabel: 'Page 6',
            url: '/coca/render/page6',
          },
        },
        page7: {
          componentType: 'SmLink',
          path: 'page7',
          params: {
            urlLabel: 'Page 7',
            url: '/coca/render/page7',
          },
        },
      },
    },
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
      {
        componentType: 'SmText',
        path: 'title-name',
        col: 6,
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'Name(/layout-content/sid98):',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'ref-to-name',
        col: 6,
        params: {
          textValue: {
            ruleType: 'refToLocalContext',
            path: '/layout-content',
            sourceParameterKey: 'sid98',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'title-parent',
        col: 6,
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'Parent(..):',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'ref-to-theresource',
        col: 6,
        params: {
          textValue: {
            ruleType: 'refToLocalContext',
            path: '..',
            sourceParameterKey: 'theresourceFromTheList',
            sourceParameterProperty: 'parent.id',
          },
        },
      },
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

const subdetail: ComponentResource = {
  content: {
    componentType: 'SmMarkup',
    path: 'ref-to-selected-entity-name',
    params: {
      markup: '<div class="col-md-12 row"><sm-item key="a"></div>',
      itemMap: {
        a: {
          componentType: 'SmText',
          path: 'rsubdetail',
          params: {
            textValue: {
              ruleType: 'constant',
              constValue: 'This is a subdetail',
            },
          },
        },
      },
    },
  },
};

const resourceDetail: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-rds-resourcedetail',
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
                { columnType: 'BUTTON', action: 'edit' },
                { columnType: 'BUTTON', action: 'addChildren' },
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
          resourceIdForDetail: 'resourceDetail',
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
              parameterKey: 'mydt1',
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
            sourceParameterKey: 'mydt1',
          },
          resourceIdForDetail: 'resourceDetail',
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
              selectedResourceKeyInLocalContext: 'sid98',
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
              //   parameterKey: 'resource2',
              //   definition: {
              //     ruleType: 'refToPageContext',
              //     path: '/layout-content',
              //     sourceParameterKey: 'sid',
              //   },
              // },
              {
                target: {
                  parameterKey: 'resourceIdFromResourceList',
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
                  parameterKey: 'theresource44',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToResource',
                  sourceResourceId: {
                    ruleType: 'refToLocalContext',
                    path: '/layout-content',
                    sourceParameterKey: 'myInputContent',
                  },
                },
              },
              {
                target: {
                  parameterKey: 'theresourceFromTheList',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToResource',
                  sourceResourceId: {
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
            col: 12,
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
              //   parameterKey: 'resourceIdFromResourceList',
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
              //   parameterKey: 'theresourceFromTheListzzzzzz',
              //   target: {
              //     targetType: 'childLocalContextPath',
              //   },
              //   definition: {
              //     ruleType: 'refToResource',
              //     sourceResourceId: {
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
            constValue: 'Select a resource here...',
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

const rAgGrid: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp12',
    border: true,
    items: [
      {
        componentType: 'SmAgGrid',
        path: 'vp13',
        col: 12,
        params: {
          textValue: {
            ruleType: 'constant',
            constValue: 'Test aggrid',
          },
        },
      },
    ],
  },
};

const rAgGridServer: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-agg-tree',
    border: true,
    items: [
      {
        componentType: 'verticalPanel',
        path: 'vp-agg1',
        border: true,
        col: 8,
        items: [
          {
            componentType: 'SmText',
            path: 'const',
            params: {
              textValue: {
                ruleType: 'constant',
                constValue: 'Exemple de Aggrid tree',
              },
            },
          },
          {
            componentType: 'aggridTree',
            path: 'aggridtree',
            params: {
              columnDefinitions: [
                { columnType: 'ID' },
                { columnType: 'NAME' },
                { columnType: 'TAGS' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'toSite', campaignId: '2023' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'toConso', campaignId: '2023' },
                { columnType: 'ATTRIBUTE', attributeConfigId: 'isCert', campaignId: '2023' },
                { columnType: 'BUTTON', action: 'edit' },
                { columnType: 'BUTTON', action: 'addChildren' },
                { columnType: 'BUTTON', action: 'select' },
                { columnType: 'BUTTON', action: 'remove' },
              ],
              valueFilter: {
                filterType: 'AND',
                items: [],
              },
              selectedResourceKeyInLocalContext: 'sid98',
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
              {
                target: {
                  parameterKey: 'resourceIdFromResourceList',
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
                  parameterKey: 'theresourceFromTheList',
                  targetType: 'currentLocalContextPath',
                },
                definition: {
                  ruleType: 'refToResource',
                  sourceResourceId: {
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
              //   parameterKey: 'resourceIdFromResourceList',
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
              //   parameterKey: 'theresourceFromTheListzzzzzz',
              //   target: {
              //     targetType: 'childLocalContextPath',
              //   },
              //   definition: {
              //     ruleType: 'refToResource',
              //     sourceResourceId: {
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
            constValue: 'Select a resource here...',
          },
        },
      },
    ],
  },
};

const rform: ComponentResource = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp12',
    border: true,
    items: [
      // {
      //   componentType: 'SmText',
      //   path: 'ref-to-theresource',
      //   params: {
      //     textValue: {
      //       ruleType: 'refToLocalContext',
      //       path: '..',
      //       sourceParameterKey: 'theresourceFromTheList',
      //       sourceParameterProperty: 'name',
      //     },
      //   },
      // },
      {
        componentType: 'OldForm',
        path: 'vsmform',
        params: {
          attributeContext: {
            resourceId: {
              ruleType: 'refToLocalContext',
              path: '..',
              sourceParameterKey: 'theresourceFromTheList',
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
              fieldId: 'theToResource',
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
                    sourceParameterKey: 'theresourceFromTheList',
                    sourceParameterProperty: 'name',
                  },
                },
              },
              {
                componentType: 'OldAttributeField',
                path: 'vsmatt',
                fieldId: 'theToResource',
              },
              {
                componentType: 'OldAttributeField',
                path: 'vsmattbool',
                fieldId: 'theToCert',
              },
              {
                componentType: 'OldAttributeField',
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
            constValue: 's1',
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

const rpageAgGrid: ComponentResource = {
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
          resourceId: 'rAgGrid',
        },
      ],
    },
  },
  parameters: [],
};

const rpageAgGridServer: ComponentResource = {
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
          resourceId: 'rAgGridServer',
        },
      ],
    },
  },
  parameters: [],
};

export const stubbedResources = {
  r3,
  page3,
  page4,
  page5,
  myform,
  page6,
  page7,
  theDetail,
  mylayout,
  pageDstree,
  topMenu,
  r4,
  r5,
  resourceDetail,
  rmenuTop,
  rlayout,
  rpage1,
  rpage2,
  rform,
  rds,
  rDsWithForm,
  rDsList,
  rDtTree,
  rAgGrid,
  rAgGridServer,
  rpageDs,
  rpageDsWithForm,
  rpageAgGrid,
  rpageAgGridServer,
  rpageDsList,
  rpageDtTree,
  subdetail,
};
