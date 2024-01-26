import { createBrowserRouter } from "react-router-dom";
import Tv from "./Routers/Tv";
import Search from "./Routers/Search";
import Home from "./Routers/Home";

const Router = createBrowserRouter([
  {
    path: `${process.env.PUBLIC_URL}/`,
    element: <Home />,
  },
  {
    path: `tv`,
    element: <Tv />,
  },
  {
    path: `serch`,
    element: <Search />,
  },
]);
export default Router;
