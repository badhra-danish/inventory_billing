import { useState } from "react";
import "./App.css";
import Approutes from "./routes/Approutes";
import { Toaster } from "react-hot-toast";
import { CategoryProvider } from "./context/Category-SubCategory/Category-Sub";
function App() {
  return (
    <>
      <CategoryProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <div>
          {" "}
          <Approutes />
        </div>
      </CategoryProvider>
    </>
  );
}

export default App;
