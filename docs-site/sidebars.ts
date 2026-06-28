import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started', 'installation', 'quickstart'],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'core-concepts/form-configuration',
        'core-concepts/dynamic-validation',
        'core-concepts/submission-storage',
        'core-concepts/conditional-logic',
      ],
    },
    {
      type: 'category',
      label: 'Features',
      items: [
        'features/flowchart-builder',
        'features/starter-templates',
        'features/api-keys',
        'features/guided-walkthrough',
        'features/authentication',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/database-schema',
        'architecture/routing-structure',
        'architecture/validation-strategy',
        'architecture/design-decisions',
      ],
    },
  ],
  apiSidebar: [
    'api/authentication',
    'api/api-keys',
    'api/forms',
    'api/submissions',
    'api/errors',
    'api/webhooks',
  ],
  guidesSidebar: [
    'guides/build-first-form',
    'guides/add-validation',
    'guides/conditional-logic',
    'guides/publish-and-share',
    'guides/integrate-via-api',
    'guides/deploy-on-render',
    'guides/docker-setup',
  ],
};

export default sidebars;
