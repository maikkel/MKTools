import { ipcMain } from "electron";
import sharp from "sharp";
import {
  getMetadata,
  makeBase64String,
  makePreview,
  resize,
  square,
} from "../utils/imageUtils";

const previewSize = 300;

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
      let image = sharp(path);

      const origSize = await image.metadata().then((md) => {
        return {
          w: md.width,
          h: md.height,
        };
      });

      let fullSize = {
        w: origSize.w,
        h: origSize.h,
      };

      if (formFields.square) {
        const maxSize = Math.max(fullSize.w, fullSize.h);

        fullSize = {
          w: maxSize,
          h: maxSize,
        };

        image = await square(
          image,
          previewSize,
          formFields.squareFit,
          formFields.squareBackground
        )
          .toBuffer()
          .then((data) => {
            return sharp(data);
          });
      }

      if (formFields.resize) {
        const width = parseInt(formFields.width) || previewSize;
        const height = parseInt(formFields.height) || previewSize;

        fullSize = {
          w: width,
          h: height,
        };

        let ratio;
        let newWidth = width;
        let newHeight = height;
        if (width > previewSize || height > previewSize) {
          if (width > height) {
            ratio = width / height;
            newWidth = previewSize;
            newHeight = previewSize / ratio;
          } else {
            ratio = height / width;
            newHeight = previewSize;
            newWidth = previewSize / ratio;
          }
        }

        if (formFields.resizeFit === "inside") {
          const boxRatio = width / height;
          const imgRatio = origSize.w / origSize.h;

          if (imgRatio > boxRatio) {
            // wider
            fullSize = {
              w: width,
              h: Math.round(width / imgRatio),
            };
          } else {
            // narrower
            fullSize = {
              w: Math.round(height * imgRatio),
              h: height,
            };
          }
        }

        image = await resize(
          image,
          newWidth,
          newHeight,
          formFields.resizeFit,
          formFields.resizeBackground
        )
          .toBuffer()
          .then((data) => {
            return sharp(data);
          });
      }

      return {
        image: await makeBase64String(makePreview(image)),
        size: fullSize,
      };
    }
  );
};

export default imageToolsController;
