const r3 = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-r3',
    items: [
      {
        componentType: 'SmText',
        path: 'test-in-r3',
        params: {
          textValue: {
            const: {
              constValue: 'ABC123',
            },
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'ref-to-selected-entity-name',
        params: {
          textValue: {
            refToPath: {
              path: '../vsmsiteList',
              property: 'selected.entity.name',
            },
          },
        },
      },
      // {
      //   componentType: 'SmInput',
      //   path: 'vsm3',
      //   params: {
      //     defaultValue: {
      //       const: 'DEFEDF',
      //     },
      //   },
      // },
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
      },
      {
        componentType: 'SmRefToResource',
        path: 'ref-to-r5',
        col: 4,
        params: {
          resourceId: 'r5',
          parameters: {
            toto: {
              refToPath: {
                path: '/vp/vsm3',
                property: 'output',
              },
            },
            titi: {
              const: {
                constValue: 'ABC123ZZZtiti',
              },
            },
            tata: {
              const: {
                constValue: 'ABC123ZZZtata',
              },
            },
            selectedResource: {
              refToPath: {
                path: '/pag-1/vp-layout/layout-content/vp-r3/vsmsiteList',
                parameterKey: 'selected',
                property: 'entity.name',
              },
            },
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
  content: {
    componentType: 'verticalPanel',
    path: 'vp2',
    border: true,
    items: [
      {
        componentType: 'SmText',
        path: 'vsm5',
        col: 4,
        params: {
          input: {
            const: '765675756',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'vsm6',
        col: 3,
        params: {
          input: {
            refToPath: '/vp/vsm3',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'vsm66',
        params: {
          input: {
            refToPath: '/vp/vsm4/vp2/vsm7',
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'vsm9',
        params: {
          input: {
            refToPath: '../vsm7',
          },
        },
      },
      {
        componentType: 'SmInput',
        path: 'vsm7',
        params: {
          defaultValue: {
            const: 'DEFEDF',
          },
        },
      },
    ],
  },
};
const r5 = {
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
      {
        componentType: 'SmText',
        path: 'ref-to-local-siteName',
        params: {
          textValue: {
            refToLocalContext: {
              parameterKey: 'site1',
              property: 'name',
            },
          },
        },
      },
      {
        componentType: 'SmText',
        path: 'ref-to-tata',
        params: {
          textValue: {
            refToLocalContext: {
              parameterKey: 'tata',
            },
          },
        },
      },
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
      parameterKey: 'sid2',
      parameterType: 'string',
    },
    {
      parameterKey: 'tata',
      parameterType: 'string',
    },
    {
      parameterKey: 'titi',
      parameterType: 'string',
    },
    {
      parameterKey: 'selectedResourceId',
      parameterType: 'string',
    },
    {
      parameterKey: 'site1',
      parameterType: 'site',
      parameterSources: [
        {
          source: 'pageContext',
          sourceParameterKey: 'sid',
        },
      ],
    },
  ],
};

const rmenuTop = {
  content: {
    componentType: 'menu',
    path: 'menu',
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
};
const rlayout = {
  content: {
    componentType: 'verticalPanel',
    path: 'vp-layout',
    items: [
      {
        componentType: 'layoutElement',
        path: 'layout-menutop',
        layoutElementId: 'menuTop',
      },
      {
        componentType: 'layoutElement',
        path: 'layout-content',
        layoutElementId: 'theContent',
      },
    ],
  },
};

const rpage1 = {
  content: {
    componentType: 'page',
    path: 'pag-1',
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
  parameters: [
    {
      parameterKey: 'sid',
      parameterType: 'string',
    },
    {
      parameterKey: 'category',
      parameterType: 'string',
    },
  ],
};

const rpage2 = {
  content: {
    componentType: 'page',
    path: 'page-2',
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
  parameters: [
    {
      parameterKey: 'sid',
      parameterType: 'string',
    },
    {
      parameterKey: 'category',
      parameterType: 'string',
    },
  ],
};

export const stubbedResources = {
  r3,
  r4,
  r5,
  rmenuTop,
  rlayout,
  rpage1,
  rpage2,
};
