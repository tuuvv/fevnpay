"use client"; // ✅ Ensure it's a Client Component

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../app/store/store"; // ✅ Ensure correct path to your store

const Providers = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
