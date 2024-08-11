// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docsSidebar: [{ type: "autogenerated", dirName: "docs" }],
  linuxSidebar: [{ type: "autogenerated", dirName: "linux" }],
  vimSidebar: [{ type: "autogenerated", dirName: "vim" }],

  // You can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

export default sidebars;