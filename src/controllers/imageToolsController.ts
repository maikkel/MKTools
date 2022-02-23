import { ipcMain } from "electron";
import sharp, { FitEnum, Metadata, Sharp } from "sharp";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import exif from "exif-reader";

const makeBase64String = async (image: Sharp): Promise<string> => {
  return await image.toBuffer().then((buffer: Buffer) => {
    return buffer.toString("base64");
  });
};

const getMetadata = async (image: Sharp): Promise<Metadata> => {
  return await image.metadata().then((md) => {
    md.exif = md.exif ? exif(md.exif) : undefined;
    return md;
  });
};

const makePreview = (image: Sharp): Sharp => {
  return image.toFormat("png").resize(600, 600, {
    fit: "contain",
    background: { r: 0, g: 255, b: 0, alpha: 0 },
  });
};

const resize = (
  image: Sharp,
  width = 600,
  height = 600,
  fit: keyof FitEnum = "contain",
  background = "#000000"
): Sharp => {
  return image.resize(width, height, {
    fit: fit,
    background: background,
  });
};

const imageToolsController = () => {
  ipcMain.handle("imageTools:getMetadata", async (_event, path: string) => {
    return await getMetadata(sharp(path));
  });

  ipcMain.handle("imageTools:getPreviewOrig", async (_event, path: string) => {
    return await makeBase64String(makePreview(sharp(path)));
  });

  ipcMain.handle(
    "imageTools:getPreview",
    async (_event, path: string, formFields: Record<string, any>) => {
      const width = parseInt(formFields.width) || 600;
      const height = parseInt(formFields.height) || 600;

      let ratio;
      let newWidth = width;
      let newHeight = height;
      if (width > 600 || height > 600) {
        if (width > height) {
          ratio = width / height;
          newWidth = 600;
          newHeight = 600 / ratio;
        } else {
          ratio = height / width;
          newHeight = 600;
          newWidth = 600 / ratio;
        }
      }

      const imageBuffer = await resize(
        sharp(path),
        newWidth,
        newHeight,
        formFields.resizeFit,
        formFields.resizeBackground
      )
        .toBuffer()
        .then((data) => {
          return data;
        });

      return await makeBase64String(makePreview(sharp(imageBuffer)));
    }
  );
};

export default imageToolsController;
