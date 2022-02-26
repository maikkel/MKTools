import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from "react";
import { Layout } from "antd";
import ImageList from "./imageTools/ImageList";
import ImagePreview from "./imageTools/ImagePreview";
import ImageForm from "./imageTools/ImageForm";

export interface ListDataItem {
  path: string;
  loading?: boolean;
  done?: boolean;
  selected?: boolean;
  thumbnail?: string;
}

interface ImageToolsProps {
  setStatus: Dispatch<SetStateAction<string>>;
}

export default function ImageTools({ setStatus }: ImageToolsProps) {
  const [listData, setListData] = useState<ListDataItem[]>([]);
  const [selectedPath, setSelectedPath] = useState<string>("");
  const [selectedImageOrig, setSelectedImageOrig] = useState<string>("");
  const [selectedImagePreview, setSelectedImagePreview] = useState<string>("");
  const [previewSize, setPreviewSize] = useState<string>("");
  const [metadata, setMetadata] = useState<Record<string, any>>(undefined);
  const [formFields, setFormFields] = useState<Record<string, any>>({});
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const loadPreview = useCallback(
    (path = "") => {
      if (path === "") {
        setSelectedImagePreview("");
      } else {
        window.api
          .invoke("imageTools:getPreview", path, formFields)
          .then((data) => {
            setSelectedImagePreview(data.image);
            setPreviewSize(`${data.size.w} x ${data.size.h} px`);
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

  const applyTools = useCallback(() => {
    forceUpdate();
    for (const item of listData) {
      item.done = false;
      item.loading = true;
      window.api.invoke("imageTools:apply", item.path, formFields).then(() => {
        item.loading = false;
        item.done = true;
        forceUpdate();
      });
    }
    forceUpdate();
  }, [formFields, listData]);

  useEffect(() => {
    const newListData: ListDataItem[] =
      JSON.parse(window.localStorage.getItem("imageTools_listData")) || [];
    for (const item of newListData) {
      item.loading = false;
      item.selected = false;
      item.done = false;
    }
    setListData(newListData);
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
        <ImageForm
          formFields={formFields}
          setFormFields={setFormFields}
          applyTools={applyTools}
        />
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
          previewSize={previewSize}
          metadata={metadata}
        />
      </Layout.Sider>
    </Layout>
  );
}
