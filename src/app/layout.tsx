"use client"; // Ensure it's a Client Component

import Providers from "./providers";
import { Layout, Menu } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../app/store/store";
import Link from "next/link";
import { useState, useEffect } from "react";

const { Header, Content, Footer } = Layout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AppLayout>{children}</AppLayout>
    </Providers>
  );
}

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cart = useSelector((state: RootState) => state?.user?.cart ?? []);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
  }, [cart]);

  const menuItems = [
    { key: "4", label: <Link href="/">Home</Link> },
    { key: "1", label: <Link href="/admin/category">Categories</Link> },
    { key: "2", label: <Link href="/admin/product">Products</Link> },
    { key: "3", label: <Link href="/user/cart">Cart ({cartCount})</Link> },
  ];

  return (
    <html className="mdl-js">
      <body data-new-gr-c-s-check-loaded="14.1223.0" data-gr-ext-installed="">
        <Layout>
          <Header className="bg-blue-500 text-white flex justify-between items-center px-4">
            <Menu theme="dark" mode="horizontal" items={menuItems} />
          </Header>
          <Content className="p-8">{children}</Content>
          <Footer className="text-center">Shop Footer</Footer>
        </Layout>
      </body>
    </html>
  );
};
