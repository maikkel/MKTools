import React, { Dispatch, SetStateAction, useState } from "react";
import { Layout } from "antd";
import ImageList from "./imageTools/ImageList";

interface ImageToolsProps {
  setStatus: Dispatch<SetStateAction<string>>;
}

export default function ImageTools({ setStatus }: ImageToolsProps) {
  const [listData, setListData] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  return (
    <Layout id="image-tools">
      <Layout.Sider width={250}>Sider 1</Layout.Sider>
      <Layout>
        <ImageList
          setListData={setListData}
          listData={listData}
          setStatus={setStatus}
          setSelectedImage={setSelectedImage}
        />
      </Layout>
      <Layout.Sider id="image-info" width={300}>
        {selectedImage && (
          <img alt="preview" src={`data:image/jpg;base64,${selectedImage}`} />
        )}
      </Layout.Sider>
    </Layout>
  );
}
