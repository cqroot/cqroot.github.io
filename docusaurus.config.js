// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "KEITH CHU",
  tagline: "A storage development engineer and Neovim enthusiast.",
  favicon: "img/favicon.svg",

  url: "https://cqroot.github.io/",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  organizationName: "cqroot",
  projectName: "cqroot.github.io",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  markdown: {
    format: "md",
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          breadcrumbs: false,
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: "315L0HA6CP",
        apiKey: "fbdf3a2a796a55211b2615d0b2db95ca",
        indexName: "cqrootio",
      },
      docs: {
        sidebar: {
          hideable: false,
        },
      },
      navbar: {
        title: "KEITH CHU",
        logo: {
          alt: "",
          src: "img/favicon.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "linuxSidebar",
            position: "left",
            label: "Linux",
          },
          {
            type: "docSidebar",
            sidebarId: "vimSidebar",
            position: "left",
            label: "Vim",
          },
          {
            type: "docSidebar",
            sidebarId: "toolsSidebar",
            position: "left",
            label: "Tools",
          },
          {
            type: "docSidebar",
            sidebarId: "othersSidebar",
            position: "left",
            label: "Others",
          },
          {
            href: "https://github.com/cqroot/cqroot.github.io",
            label: "GitHub",
            position: "right",
          },
        ],
      },

      footer: {
        style: "dark",
        links: [
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/cqroot/cqroot.github.io",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },

      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ["bash"],
      },
    }),
};

export default config;
