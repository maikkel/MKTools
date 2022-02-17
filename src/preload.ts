import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("api", {
  test: () => {
    return "hello!!!!";
  },
});
