import React, { Dispatch, MouseEvent, SetStateAction, useRef } from "react";
import { Button, Layout, List, Upload } from "antd";
import { RcFile } from "antd/es/upload";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

interface ImageListProps {
  setListData: Dispatch<SetStateAction<string[]>>;
  listData: string[];
  setStatus: Dispatch<SetStateAction<string>>;
  setSelectedPath: Dispatch<SetStateAction<string>>;
  loadPreview: (path?: string) => void;
}

export default function ImageList({
  setListData,
  listData,
  setStatus,
  setSelectedPath,
  loadPreview,
}: ImageListProps) {
  const addCount = useRef<number>(0);
  const addCountAdded = useRef<number>(0);
  const addCountDuplicate = useRef<number>(0);
  const addCountWrongFormat = useRef<number>(0);

  const handleUpload = (file: RcFile, fileList: RcFile[]) => {
    addCount.current++;
    if (!listData.includes(file.path)) {
      if (file.type.startsWith("image")) {
        setListData((prevState) => {
          return [...prevState, file.path].sort();
        });
        addCountAdded.current++;
      } else {
        addCountWrongFormat.current++;
      }
    } else {
      addCountDuplicate.current++;
    }

    if (addCount.current === fileList.length) {
      let statusText = `Total ${addCount.current} new files`;
      statusText += addCountAdded.current
        ? `, ${addCountAdded.current} added`
        : "";
      statusText += addCountDuplicate.current
        ? `, ${addCountDuplicate.current} duplicates omitted`
        : "";
      statusText += addCountWrongFormat.current
        ? `, ${addCountWrongFormat.current} non images omitted`
        : "";
      setStatus(statusText);

      addCount.current = 0;
      addCountAdded.current = 0;
      addCountDuplicate.current = 0;
      addCountWrongFormat.current = 0;
    }

    return false;
  };

  const onSelect = (event: MouseEvent) => {
    const element = event.target as HTMLTextAreaElement;

    if (!element.classList.contains("active-list-item")) {
      const elems = document.querySelector(".active-list-item");
      if (elems !== null) {
        elems.classList.remove("active-list-item");
      }
      element.classList.add("active-list-item");
      const path = element.firstChild.textContent;
      setSelectedPath(path);

      loadPreview(path);
    }
  };

  const onClear = () => {
    setListData([]);
    loadPreview();
    setStatus(`cleared list`);
  };

  return (
    <>
      <Layout.Header className="header">
        <Upload
          beforeUpload={handleUpload}
          multiple={true}
          showUploadList={false}
        >
          <Button
            className="upload-button"
            size="small"
            type="primary"
            icon={<PlusOutlined />}
          >
            Add Files
          </Button>
        </Upload>
        or drag and drop in area below
        {listData.length && (
          <Button
            className="delete-button"
            size="small"
            type="primary"
            danger
            onClick={onClear}
            icon={<CloseOutlined />}
          >
            clear list
          </Button>
        )}
      </Layout.Header>

      <Layout.Content className="list-container">
        <Upload.Dragger
          className="dragger"
          openFileDialogOnClick={false}
          beforeUpload={handleUpload}
          multiple={true}
          showUploadList={false}
        >
          <List
            size="small"
            className="list"
            header={<div>{listData.length} FILES</div>}
            bordered
            dataSource={listData}
            renderItem={(item, index) => (
              <List.Item
                className="list-item"
                actions={[
                  <Button
                    key={`delete-${index}`}
                    size="small"
                    type="primary"
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setListData((prevState) => {
                        return prevState.filter((e) => e !== item);
                      });
                      loadPreview();
                      setStatus(`removed from list: ${item}`);
                    }}
                  />,
                ]}
                onMouseDown={onSelect}
              >
                {item}
              </List.Item>
            )}
          />
        </Upload.Dragger>
      </Layout.Content>
    </>
  );
}
