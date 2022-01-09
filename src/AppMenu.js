// const isMac = process.platform === "darwin";
// const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

const templateProd = [
  // { role: 'appMenu' }
  ...(isMac ? [] : []),
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [isMac ? { role: "close" } : { role: "quit" }],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [{ role: "reload" }, { role: "forceReload" }],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Project Page",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://github.com/WGLabz/kafka-explorer");
        },
      },
    ],
  },
];

var menuTemplate = templateProd; //isDev ? templateDev : templateProd;
export default menuTemplate;
