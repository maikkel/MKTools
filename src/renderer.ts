/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

declare global {
  interface Window {
    api: {
      test: () => string;
      send: (channel: string, ...args: any[]) => void;
      on: (
        channel: string,
        listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void
      ) => Electron.IpcRenderer;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
  }
}
import "./ui";
