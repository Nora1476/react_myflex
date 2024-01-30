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
    path: `movies/:id`,
    element: <Home />,
  },
  {
    path: `tv`,
    element: <Tv />,
  },
  {
    path: `tv/:id`,
    element: <Tv />,
  },
  {
    path: `search`,
    element: <Search />,
  },
]);
export default Router;
