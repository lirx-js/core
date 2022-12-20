// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

// const lightCodeTheme = require('prism-react-renderer/themes/github');
// const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('./themes/prism/github');
const darkCodeTheme = require('./themes/prism/dracula');
// const darkCodeTheme = require('prism-react-renderer/themes/nightOwl');
// const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

const organizationName = 'lirx-js';
const projectName = 'core';

const githubURL = `https://github.com/${organizationName}/${projectName}/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'LiRX/core',
  tagline: 'The Reactive Programing framework',
  url: 'https://core.lirx.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logos/favicon.ico',

  // github
  organizationName,
  projectName,
  trailingSlash: true,

  // i18n
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    // locales: ['en', 'fr'],
    // localeConfigs: {
    //   en: {
    //     htmlLang: 'en-GB',
    //   },
    // },
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: `${githubURL}tree/main/website`,
        },
        blog: {
          showReadingTime: true,
          editUrl: `${githubURL}tree/main/website`,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      metadata: [
        {
          name: 'keywords',
          content: 'Reactive Programing, framework',
        },
      ],
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      announcementBar: {
        id: 'support_us',
        content:
          '⭐️ If you like LiRX/core, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/lirx-js/core">GitHub</a>! ⭐️',
        backgroundColor: '#fafbfc',
        textColor: '#091E42',
        isCloseable: true,
      },
      navbar: {
        title: 'LiRX/core',
        logo: {
          alt: 'LiRX/core Logo',
          src: 'img/logos/lirx-core-logo.png',
        },
        items: [
          {
            label: 'Docs',
            type: 'docSidebar',
            sidebarId: 'documentation',
            position: 'left',
          },
          {
            label: 'Reference',
            type: 'docSidebar',
            sidebarId: 'reference',
            position: 'left',
          },
          // {
          //   label: 'Decision tree',
          //   type: 'doc',
          //   docId: 'documentation/decision-tree/index',
          //   position: 'left',
          // },
          // {
          //   label: 'Decision tree',
          //   to: 'docs/documentation/decision-tree',
          //   position: 'left',
          // },
          {
            label: 'Blog',
            to: '/blog',
            position: 'left',
          },
          // {
          //   type: 'localeDropdown',
          //   position: 'right',
          //   // dropdownItemsAfter: [
          //   //   {
          //   //     type: 'html',
          //   //     value: '<hr style="margin: 0.3rem 0;">',
          //   //   },
          //   //   {
          //   //     href: 'https://github.com/facebook/docusaurus/issues/3526',
          //   //     label: 'Help Us Translate',
          //   //   },
          //   // ],
          // },
          {
            label: 'GitHub',
            href: githubURL,
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Introduction',
                to: '/docs/documentation/getting-started/introduction/',
              },
              {
                label: 'Example',
                to: '/docs/documentation/example/',
              },
            ],
          },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Ask for a functionality',
          //       href: 'https://github.com/lirx-js/core/discussions',
          //     },
          //   ],
          // },
          {
            title: 'Ecosystem',
            items: [
              {
                label: 'LiRX/core',
                href: 'https://core.lirx.org',
              },
              {
                label: 'LiRX/dom',
                href: 'https://dom.lirx.org',
              },
              {
                label: 'LiRX/router',
                // href: 'https://router.lirx.org',
                href: 'https://github.com/lirx-js/router',
              },
              {
                label: 'LiRX/i18n',
                // href: 'https://i18n.lirx.org',
                href: 'https://github.com/lirx-js/i18n',
              },
              {
                label: 'LiRX/store',
                // href: 'https://store.lirx.org',
                href: 'https://github.com/lirx-js/store',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog/',
              },
              {
                label: 'Changelog',
                to: '/docs/changelogs/1.2.0/',
              },
              {
                label: 'GitHub',
                href: githubURL,
              },
              {
                label: 'Ask for a functionality',
                href: `${githubURL}discussions`,
              },
            ],
          },
          // {
          //   title: 'More',
          //   items: [
          //     {
          //       label: 'Blog',
          //       to: '/blog',
          //     },
          //     {
          //       label: 'GitHub',
          //       href: 'https://github.com/facebook/docusaurus',
          //     },
          //   ],
          // },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} @lirx/core, owned by Valentin Richard and maintained with love by all the community ♥.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
  plugins: [
    // // https://github.com/cmfcmf/docusaurus-search-local
    // require.resolve('@cmfcmf/docusaurus-search-local'),
  ],
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
      },
    ],
  ],
};

module.exports = config;
