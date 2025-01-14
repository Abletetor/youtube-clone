import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Video from "./pages/Video/Video";
import { useState } from "react";
const App = () => {
   const [sidebar, setSidebar] = useState(true);
   return (
      <>
         <Navbar setSidebar={ setSidebar } />
         <Routes>
            <Route path="/" element={ <Home sidebar={ sidebar } /> } />
            <Route path="/video/:videoId/:categoryId" element={ <Video /> } />
         </Routes>
      </>
   );
};

export default App;