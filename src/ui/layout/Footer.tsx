import React from "react";
import { Layout } from "antd";

interface FooterProps {
  status: string;
}
export default function Footer({ status }: FooterProps) {
  return <Layout.Footer id="footer">{status}</Layout.Footer>;
}
