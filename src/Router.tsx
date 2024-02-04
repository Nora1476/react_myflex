import { createBrowserRouter } from "react-router-dom";
import Tv from "./Routers/Tv";
import Search from "./Routers/Search";
import Home from "./Routers/Home";
import Detail from "./Components/Detail";

const Router = createBrowserRouter([
  {
    path: `${process.env.PUBLIC_URL}/`,
    element: <Home />,
    children: [],
  },
  {
    path: `movies/:id`,
    element: <Home />,
  },
  {
    path: `${process.env.PUBLIC_URL}/tv`,
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
  {
    path: `detail/:id`,
    element: <Detail />,
  },
]);
export default Router;
