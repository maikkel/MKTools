import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Layout } from "antd";
import ImageList from "./imageTools/ImageList";
import ImagePreview from "./imageTools/ImagePreview";
import ImageForm from "./imageTools/ImageForm";

interface ImageToolsProps {
  setStatus: Dispatch<SetStateAction<string>>;
}

export default function ImageTools({ setStatus }: ImageToolsProps) {
  const [listData, setListData] = useState<string[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [selectedImageOrig, setSelectedImageOrig] = useState<string>("");
  const [selectedImagePreview, setSelectedImagePreview] = useState<string>("");
  const [metadata, setMetadata] = useState<Record<string, any>>(undefined);
  const [formFields, setFormFields] = useState<Record<string, any>>({});

  const loadPreview = useCallback(
    (path = "") => {
      if (path === "") {
        setSelectedImagePreview("");
      } else {
        window.api
          .invoke("imageTools:getPreview", path, formFields)
          .then((data) => {
            setSelectedImagePreview(data);
          });
      }
    },
    [formFields]
  );

  const loadPreviewOrig = useCallback((path = "") => {
    if (path === "") {
      setSelectedImageOrig("");
      setMetadata(null);
    } else {
      window.api.invoke("imageTools:getPreviewOrig", path).then((data) => {
        setSelectedImageOrig(data);
      });
      window.api.invoke("imageTools:getMetadata", path).then((data) => {
        setMetadata(data);
      });
    }
  }, []);

  useEffect(() => {
    setListData(
      JSON.parse(window.localStorage.getItem("imageTools_listData")) || []
    );
    setFormFields(
      JSON.parse(window.localStorage.getItem("imageTools_formFields")) || {}
    );
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "imageTools_listData",
      JSON.stringify(listData)
    );
  }, [listData]);

  useEffect(() => {
    window.localStorage.setItem(
      "imageTools_formFields",
      JSON.stringify(formFields)
    );
    loadPreview(selectedPath);
  }, [formFields, selectedPath, loadPreview]);

  useEffect(() => {
    loadPreviewOrig(selectedPath);
  }, [selectedPath, loadPreviewOrig]);

  return (
    <Layout id="image-tools">
      <Layout.Sider id="image-form" width={250}>
        <ImageForm formFields={formFields} setFormFields={setFormFields} />
      </Layout.Sider>
      <Layout id="image-list">
        <ImageList
          setListData={setListData}
          listData={listData}
          setStatus={setStatus}
          setSelectedPath={setSelectedPath}
        />
      </Layout>
      <Layout.Sider id="image-info" width={300}>
        <ImagePreview
          selectedImageOrig={selectedImageOrig}
          selectedImagePreview={selectedImagePreview}
          metadata={metadata}
        />
      </Layout.Sider>
    </Layout>
  );
}
