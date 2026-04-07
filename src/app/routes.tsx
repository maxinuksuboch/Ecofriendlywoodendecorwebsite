import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { HomePage } from "./components/HomePage";
import { CatalogPage } from "./components/CatalogPage";
import { ProductDetailPage } from "./components/ProductDetailPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "catalog", Component: CatalogPage },
      { path: "product/wooden-world-maps", Component: ProductDetailPage },
    ],
  },
]);
