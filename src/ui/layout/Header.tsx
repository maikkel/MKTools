import React from "react";
import { Layout, Menu } from "antd";
import { MenuInfo } from "rc-menu/lib/interface";
import logo from "../_img/logo_white_small.svg";
import navigation from "../data/navigation";

interface HeaderProps {
  setNav: (index: number) => void;
}
export default function Header({ setNav }: HeaderProps) {
  const onAppChange = (info: MenuInfo): void => {
    setNav(parseInt(info.key));
  };

  const makeMenuItems = () => {
    return navigation.map((item, index) => {
      return (
        <Menu.Item className="button" key={index}>
          {item.title}
        </Menu.Item>
      );
    });
  };

  return (
    <Layout.Header id="header">
      <Layout>
        <Layout.Sider width={300} className="logo-container">
          <img src={logo} className="logo" alt="logo" />
          <span className="logo-text">TOOLS</span>
        </Layout.Sider>
        <Layout.Content>
          <Menu
            className="menu"
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["0"]}
            onClick={onAppChange}
          >
            {makeMenuItems()}
          </Menu>
        </Layout.Content>
      </Layout>
    </Layout.Header>
  );
}
