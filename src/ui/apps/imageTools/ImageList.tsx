import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button, Layout, List, Radio, Upload } from "antd";
import { RcFile } from "antd/es/upload";
import {
  CloseOutlined,
  PlusOutlined,
  UnorderedListOutlined,
  AppstoreOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { ListDataItem } from "../ImageTools";

interface ImageListProps {
  setListData: Dispatch<SetStateAction<ListDataItem[]>>;
  listData: ListDataItem[];
  setStatus: Dispatch<SetStateAction<string>>;
  setSelectedPath: Dispatch<SetStateAction<string>>;
}

export default function ImageList({
  setListData,
  listData,
  setStatus,
  setSelectedPath,
}: ImageListProps) {
  const [layout, setLayout] = useState<string>("list");
  const addCount = useRef<number>(0);
  const addCountAdded = useRef<number>(0);
  const addCountDuplicate = useRef<number>(0);
  const addCountWrongFormat = useRef<number>(0);

  const handleUpload = (file: RcFile, fileList: RcFile[]) => {
    addCount.current++;
    if (listData.filter((item) => item.path === file.path).length === 0) {
      if (file.type.startsWith("image")) {
        const newItem: ListDataItem = { path: file.path };
        window.api.invoke("imageTools:getThumbnail", file.path).then((data) => {
          newItem.thumbnail = data;
          setListData((prevState) => {
            return [...prevState, newItem].sort((a, b) =>
              a.path > b.path ? 1 : -1
            );
          });
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

  const onClear = () => {
    setListData([]);
    setSelectedPath("");
    setStatus(`cleared list`);
  };

  useEffect(() => {
    setLayout(
      JSON.parse(window.localStorage.getItem("imageTools_settings_layout")) ||
        "list"
    );
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "imageTools_settings_layout",
      JSON.stringify(layout)
    );
  }, [layout]);

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
            Clear List
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
            grid={layout !== "list" && { gutter: 0 }}
            size="small"
            className={"list " + `layout-${layout}`}
            header={
              <div>
                {listData.length} FILES (Click for preview)
                <Radio.Group
                  className="layout-switch"
                  onChange={(event) => {
                    setLayout(event.target.value);
                  }}
                  value={layout}
                  buttonStyle="solid"
                >
                  <Radio.Button value="list">
                    <UnorderedListOutlined />
                  </Radio.Button>
                  <Radio.Button value="icons">
                    <AppstoreOutlined />
                  </Radio.Button>
                </Radio.Group>
              </div>
            }
            bordered
            dataSource={listData}
            renderItem={(item, index) => (
              <List.Item
                className={
                  "list-item " + (item.selected ? "active-list-item" : "")
                }
                actions={[
                  <LoadingOutlined
                    className={
                      "icon icon-loading " + (item.loading ? "" : "hidden")
                    }
                    key={`loading-${index}`}
                  />,
                  <CheckCircleOutlined
                    className={"icon icon-done " + (item.done ? "" : "hidden")}
                    key={`loading-${index}`}
                  />,
                  <Button
                    key={`delete-${index}`}
                    size="small"
                    type="primary"
                    danger
                    icon={<CloseOutlined />}
                    onMouseDown={(event) => {
                      event.stopPropagation();
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      if (item.selected) {
                        setSelectedPath("");
                      }
                      setListData((prevState) => {
                        return prevState.filter((e) => e !== item);
                      });
                      setStatus(`removed from list: ${item.path}`);
                    }}
                  />,
                ]}
                onMouseDown={() => {
                  for (const i of listData) {
                    i.selected = false;
                  }
                  item.selected = true;
                  setSelectedPath(item.path);
                }}
              >
                <img
                  alt="preview"
                  draggable="false"
                  src={
                    item.thumbnail && `data:image/png;base64,${item.thumbnail}`
                  }
                />
                <span className="path">{item.path}</span>
              </List.Item>
            )}
          />
        </Upload.Dragger>
      </Layout.Content>
    </>
  );
}
