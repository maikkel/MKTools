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
      <Layout.Sider width={300}>
        {selectedImage && <img src={`file:/${selectedImage}`} />}
      </Layout.Sider>
    </Layout>
  );
}
