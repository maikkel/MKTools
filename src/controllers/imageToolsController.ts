import { ipcMain } from "electron";
import sharp, { Metadata, Sharp } from "sharp";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import exif from "exif-reader";

const makeBase64String = async (image: Sharp): Promise<string> => {
  return await image.toBuffer().then((buffer: Buffer) => {
    return buffer.toString("base64");
  });
};

const getMetadata = async (image: Sharp): Promise<Metadata> => {
  return await image
    .metadata()
    .then((md) => {
      md.exif = md.exif ? exif(md.exif) : undefined;
      return md;
    })
    .catch((reason) => {
      console.log(reason);
      return undefined;
    });
};

const imageToolsController = () => {
  ipcMain.handle("imageTools:getPreview", async (_event, path) => {
    const image = sharp(path);
    const metadata = await getMetadata(image);

    image
      .toFormat("png")
      .rotate()
      .resize(600, 600, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      });

    return {
      imgString: await makeBase64String(image),
      metadata: metadata,
    };
  });
};

export default imageToolsController;
