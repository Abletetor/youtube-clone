import React, { useState } from 'react';
import './Navbar.css';
import menu_icon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import searchIcon from '../../assets/search.png';
import uploadIcon from '../../assets/upload.png';
import moreIcon from '../../assets/more.png';
import voiceIcon from '../../assets/voice-search.png';
import notificationIcon from '../../assets/notification.png';
import profileIcon from '../../assets/jack.png';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar ({ setSidebar }) {
   const [searchTerm, setSearchTerm] = useState('');
   const navigate = useNavigate();

   const handleSearch = () => {
      if (searchTerm.trim()) {
         navigate(`/search/${encodeURIComponent(searchTerm)}`);
         setSearchTerm(''); // Clear input after search
      }
   };

   const handleKeyPress = (e) => {
      if (e.key === 'Enter') handleSearch();
   };

   return (
      <nav className="flex-div">
         <div className="nav-left flex-div">
            <img
               src={ menu_icon }
               alt="Menu"
               className="menu-icon"
               onClick={ () => setSidebar((prev) => !prev) }
            />
            <Link to="/">
               <img src={ logo } alt="Logo" className="logo" />
            </Link>
         </div>
         <div className="nav-middle flex-div">
            <div className="search-box">
               <input
                  type="text"
                  placeholder="Search"
                  value={ searchTerm }
                  onChange={ (e) => setSearchTerm(e.target.value) }
                  onKeyDown={ handleKeyPress }
                  aria-label="Search"
               />
               <img src={ searchIcon } alt="Search Icon"
                  onClick={ handleSearch }
               />
            </div>
            <div className="search-voice">
               <img src={ voiceIcon } alt="Voice Search" title="Search with voice" />
            </div>
         </div>
         <div className="nav-right flex-div">
            <img src={ uploadIcon } alt="Upload" title="Upload" />
            <img src={ moreIcon } alt="More" title="More" />
            <img src={ notificationIcon } alt="Notification" title="Notifications" />
            <img src={ profileIcon } alt="Profile" className="user-icon" />
         </div>
      </nav>
   );
}
