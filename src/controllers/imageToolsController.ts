import { ipcMain } from "electron";
import sharp, { Metadata } from "sharp";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import exif from "exif-reader";

const imageToolsController = () => {
  ipcMain.handle("imageTools:getPreview", async (_event, path) => {
    let base64String: string;
    let metadata: Metadata;

    const image = sharp(path);

    await image.metadata().then((md) => {
      metadata = md;
    });

    await image
      .rotate()
      .resize(600, 600, {
        fit: "contain",
      })
      .toBuffer()
      .then((buffer: Buffer) => {
        base64String = buffer.toString("base64");
      });

    metadata.exif = exif(metadata.exif);

    return {
      imgString: base64String,
      metaData: metadata,
    };
  });
};

export default imageToolsController;
