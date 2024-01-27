import { BrowserRouter, RouterProvider } from "react-router-dom";
import Router from "./Router";
import Header from "./Components/Header";
function App() {
  return (
    <>
      <RouterProvider router={Router}></RouterProvider>;
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    </>
  );
}

export default App;
