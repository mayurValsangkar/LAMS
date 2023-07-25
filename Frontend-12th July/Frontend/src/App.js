import { Button } from "@chakra-ui/react";
import "./App.css";
import { Route, Redirect } from "react-router-dom/cjs/react-router-dom.min";
import Homepage from "./pages/Homepage";
import Dashpage from "./pages/Dashpage";

function App() {
  const isLoggedIn = sessionStorage.getItem("login") === "true";
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />
      <Route
        path="/dashboard" component={Dashpage} exact/>
    </div>
  );
}

export default App;
