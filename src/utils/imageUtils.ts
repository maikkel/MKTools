import { FitEnum, Metadata, Sharp } from "sharp";
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

const makePreview = (image: Sharp, size: number): Sharp => {
  return image
    .toFormat("png")
    .flatten()
    .resize(size, size, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
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

const square = (
  image: Sharp,
  size = 600,
  fit: keyof FitEnum = "contain",
  background = "#000000"
) => {
  return resize(image, size, size, fit, background);
};

export { makeBase64String, getMetadata, makePreview, resize, square };
