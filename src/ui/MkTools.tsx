import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import Header from "./layout/Header";
import navigation from "./data/navigation";
import Footer from "./layout/Footer";

export default function MkTools() {
  const [status, setStatus] = useState<string>("Status");
  const [component, setComponent] = useState<JSX.Element>(null);

  useEffect(() => {
    setNavigation(0);
  }, []);

  const setNavigation = (index: number) => {
    setStatus(`Switched to ${navigation[index].title}`);
    const Component = navigation[index].component;
    setComponent(<Component setStatus={setStatus} />);
  };

  return (
    <Layout className="layout">
      <Header setNav={setNavigation} />
      {component}
      <Footer status={status} />
    </Layout>
  );
}
