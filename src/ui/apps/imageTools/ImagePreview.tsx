import React from "react";

interface ImagePreviewProps {
  selectedImageOrig: string;
  selectedImagePreview: string;
  metadata: Record<string, any>;
}

export default function ImagePreview({
  selectedImageOrig,
  selectedImagePreview,
  metadata,
}: ImagePreviewProps) {
  return (
    <>
      {selectedImageOrig && (
        <div className="image-orig">
          <div className="title">ORIGINAL</div>
          <img
            alt="preview"
            src={`data:image/png;base64,${selectedImageOrig}`}
          />
        </div>
      )}
      {selectedImagePreview && (
        <div className="image-preview">
          <div className="title">PREVIEW</div>
          <img
            alt="preview"
            src={`data:image/png;base64,${selectedImagePreview}`}
          />
        </div>
      )}
      {metadata && (
        <>
          <table className="image-preview-table">
            <tbody>
              <tr>
                <td className="title" colSpan={2}>
                  GENERAL INFO
                </td>
              </tr>
              <tr>
                <td>Format:</td>
                <td>{metadata.format}</td>
              </tr>
              <tr>
                <td>Size:</td>
                <td>
                  {metadata.width} x {metadata.height} px
                </td>
              </tr>
              <tr>
                <td>Color space:</td>
                <td>{metadata.space}</td>
              </tr>
            </tbody>
          </table>
          {metadata.exif && (
            <table className="image-preview-table">
              <tbody>
                <tr>
                  <td className="title" colSpan={2}>
                    EXIF DATA:
                  </td>
                </tr>
                <tr>
                  <td>Camera:</td>
                  <td>
                    {metadata.exif.image.Make} {metadata.exif.image.Model}
                  </td>
                </tr>
                <tr>
                  <td>Lens:</td>
                  <td>{metadata.exif.exif.LensModel}</td>
                </tr>
                <tr>
                  <td>Focal Length</td>
                  <td>
                    {metadata.exif.exif.FocalLength}
                    {"mm"}
                    {metadata.exif.exif.FocalLength !==
                      metadata.exif.exif.FocalLengthIn35mmFormat &&
                      ` (equiv ${metadata.exif.exif.FocalLengthIn35mmFormat}mm)`}
                  </td>
                </tr>
                <tr>
                  <td>Shutter Speed:</td>
                  <td>{metadata.exif.exif.ShutterSpeedValue}</td>
                </tr>
                <tr>
                  <td>Aperture:</td>
                  <td>{metadata.exif.exif.ApertureValue}</td>
                </tr>
                <tr>
                  <td>ISO:</td>
                  <td>{metadata.exif.exif.ISO}</td>
                </tr>
                <tr>
                  <td>Software:</td>
                  <td>{metadata.exif.image.Software}</td>
                </tr>
                <tr>
                  <td>Copyright:</td>
                  <td>{metadata.exif.image.Copyright}</td>
                </tr>
              </tbody>
            </table>
          )}
        </>
      )}
    </>
  );
}
