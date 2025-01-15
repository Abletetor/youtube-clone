import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Video from "./pages/Video/Video";
import SearchResults from "./pages/SearchResults/SearchResults";
import { useState } from "react";
const App = () => {
   const [sidebar, setSidebar] = useState(true);
   const [categoryId, setCategoryId] = useState(0);
   return (
      <>
         <Navbar setSidebar={ setSidebar } />
         <Routes>
            <Route path="/" element={ <Home sidebar={ sidebar } /> } />
            <Route path="/search/:searchTerm" element={ <SearchResults categoryId={ categoryId } /> } />
            <Route path="/video/:videoId/:categoryId" element={ <Video /> } />
         </Routes>
      </>
   );
};

export default App;