import { BrowserRouter, RouterProvider } from "react-router-dom";
import Router from "./Router";
import Header from "./Components/Header";
import { Helmet } from "react-helmet";
function App() {
  return (
    <>
      <Helmet>
        <title>Myflex</title>
      </Helmet>
      <RouterProvider router={Router}></RouterProvider>;
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Header />
      </BrowserRouter>
    </>
  );
}

export default App;
