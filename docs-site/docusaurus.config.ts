import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';

const config: Config = {
  title: 'FormEngine Pro',
  tagline: 'The world\'s most advanced dynamic form builder engine',
  favicon: "img/logo.svg",
  url: 'https://chama18.github.io',
  baseUrl: '/formengine-pro/',
  organizationName: 'CHAMA18',
  projectName: 'formengine-pro',
  trailingSlash: false,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/CHAMA18/formengine-pro/edit/docs/docs-site/docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies import('@docusaurus/preset-classic').Options,
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'FormEngine Pro',
      logo: {
        alt: 'FormEngine Pro Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'API Reference',
        },
        {
          type: 'docSidebar',
          sidebarId: 'guidesSidebar',
          position: 'left',
          label: 'Guides',
        },
        {
          href: 'https://formengine-pro.onrender.com',
          label: 'Live App',
          position: 'right',
        },
        {
          href: 'https://github.com/CHAMA18/formengine-pro',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Getting Started', to: '/docs/getting-started' },
            { label: 'Architecture', to: '/docs/architecture/overview' },
            { label: 'API Reference', to: '/api/authentication' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/CHAMA18/formengine-pro' },
            { label: 'Live App', href: 'https://formengine-pro.onrender.com' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Blog', to: '/blog' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} FormEngine Pro. Built with precision.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'python'],
    },
    announcementBar: {
      id: 'launch',
      content: '🚀 FormEngine Pro is live! <a href="https://formengine-pro.onrender.com">Try it now</a>',
      backgroundColor: '#f59e0b',
      textColor: '#ffffff',
      isCloseable: true,
    },
  },
};

export default config;
