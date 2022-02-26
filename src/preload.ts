import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  send: ipcRenderer.send,
  on: ipcRenderer.on,
  invoke: ipcRenderer.invoke,

  test: () => {
    return "hello!!!!";
  },
});
