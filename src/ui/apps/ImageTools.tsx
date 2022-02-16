import React, { Dispatch, SetStateAction, useState } from "react";
import { Layout } from "antd";
import ImageList from "./imageTools/ImageList";

interface ImageToolsProps {
  setStatus: Dispatch<SetStateAction<string>>;
}

export default function ImageTools({ setStatus }: ImageToolsProps) {
  const [listData, setListData] = useState<string[]>([]);

  return (
    <Layout id="image-tools">
      <Layout.Sider width={250}>Sider 1</Layout.Sider>
      <Layout>
        <ImageList
          setListData={setListData}
          listData={listData}
          setStatus={setStatus}
        />
      </Layout>
      <Layout.Sider width={300}>Sider 2</Layout.Sider>
    </Layout>
  );
}
