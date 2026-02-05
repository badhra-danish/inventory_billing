import "./App.css";
import Approutes from "./routes/Approutes";
import { Toaster } from "react-hot-toast";
import { CategoryProvider } from "./context/Category-SubCategory/Category-Sub";
import { ThemeProvider } from "./context/DarkthemProvider";
import { AuthProvider } from "./context/authContext";
function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <CategoryProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <div>
              {" "}
              <Approutes />
            </div>
          </CategoryProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
