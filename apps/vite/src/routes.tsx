import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);


export default function Routes() {
    return <RouterProvider router={router} />;
}