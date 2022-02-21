import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
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
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [metadata, setMetadata] = useState<Record<string, any>>(undefined);
  const [formFields, setFormFields] = useState<Record<string, any>>(undefined);

  useEffect(() => {
    setListData(
      JSON.parse(window.localStorage.getItem("imageTools_listData")) || []
    );
    setFormFields(
      JSON.parse(window.localStorage.getItem("imageTools_formFields")) || null
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
  }, [formFields]);

  const loadPreview = (path = "") => {
    if (path === "") {
      setSelectedImage("");
      setMetadata(null);
    } else {
      window.api.invoke("imageTools:getPreview", path).then((data) => {
        setSelectedImage(data.imgString);
        setMetadata(data.metadata);
      });
    }
  };

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
          loadPreview={loadPreview}
        />
      </Layout>
      <Layout.Sider id="image-info" width={300}>
        <ImagePreview selectedImage={selectedImage} metadata={metadata} />
      </Layout.Sider>
    </Layout>
  );
}
