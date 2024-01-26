import { RouterProvider } from "react-router-dom";
import Router from "./Router";
import Header from "./Components/Header";
function App() {
  return (
    <>
      <RouterProvider router={Router}></RouterProvider>;
      <Header />
    </>
  );
}

export default App;
