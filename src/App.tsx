import { useState } from "react";
import "./App.css";
import Approutes from "./routes/Approutes";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <>
      //
      <Toaster position="top-center" reverseOrder={false} />
      <Approutes />
    </>
  );
}

export default App;
