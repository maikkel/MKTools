import { ipcMain } from "electron";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import {
  getMetadata,
  makeBase64String,
  makePreview,
  resize,
  square,
} from "../utils/imageUtils";

const previewSize = 300;

const appendToFilename = (filename: string, string: string) => {
  const dotIndex = filename.lastIndexOf(".");
  if (dotIndex == -1) return filename + string;
  else
    return (
      filename.substring(0, dotIndex) + string + filename.substring(dotIndex)
    );
};

const imageToolsController = () => {
  ipcMain.handle(
    "imageTools:apply",
    async (_event, pathString: string, formFields: Record<string, any>) => {
      // return await new Promise((resolve) =>
      //   setTimeout(resolve, Math.floor(Math.random() * (3000 - 500 + 1) + 500))
      // );

      let image = sharp(pathString);

      const origSize = await image.metadata().then((md) => {
        return {
          w: md.width,
          h: md.height,
        };
      });

      if (formFields.square) {
        const maxSize = Math.max(origSize.w, origSize.h);

        image = await square(
          image,
          maxSize,
          formFields.squareFit,
          formFields.squareBackground
        )
          .toBuffer()
          .then((data) => {
            return sharp(data);
          });
      }

      if (formFields.resize) {
        const width = parseInt(formFields.width) || origSize.w;
        const height = parseInt(formFields.height) || origSize.h;

        image = await resize(
          image,
          width,
          height,
          formFields.resizeFit,
          formFields.resizeBackground
        )
          .toBuffer()
          .then((data) => {
            return sharp(data);
          });
      }

      const newDir = path.join(
        path.dirname(pathString),
        formFields.subFolder || "processed"
      );

      let fileName = path.basename(pathString);

      if (formFields.fileSuffix) {
        fileName = appendToFilename(fileName, formFields.fileSuffix);
      }

      fs.mkdir(newDir, { recursive: true }, (err) => {
        if (err) throw err;
      });

      const newPath = path.join(newDir, fileName);

      return await image.toFile(newPath).then((info) => {
        return info;
      });
    }
  );

  ipcMain.handle("imageTools:getMetadata", async (_event, path: string) => {
    return await getMetadata(sharp(path));
  });

  ipcMain.handle("imageTools:getPreviewOrig", async (_event, path: string) => {
    return await makeBase64String(makePreview(sharp(path), previewSize));
  });

  ipcMain.handle("imageTools:getThumbnail", async (_event, path: string) => {
    return await makeBase64String(makePreview(sharp(path), 60));
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
        image: await makeBase64String(makePreview(image, previewSize)),
        size: fullSize,
      };
    }
  );
};

export default imageToolsController;
