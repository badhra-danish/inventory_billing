import "./App.css";
import Approutes from "./routes/Approutes";
import { Toaster } from "react-hot-toast";
import { CategoryProvider } from "./context/Category-SubCategory/Category-Sub";
import { ThemeProvider } from "./context/DarkthemProvider";
function App() {
  return (
    <>
      <ThemeProvider>
        <CategoryProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <div>
            {" "}
            <Approutes />
          </div>
        </CategoryProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
