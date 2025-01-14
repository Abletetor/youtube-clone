import React from 'react';
import './Navbar.css';
import menu_icon from '../../assets/menu.png';
import logo from '../../assets/logo.png';
import searchIcon from '../../assets/search.png';
import uploadIcon from '../../assets/upload.png';
import moreIcon from '../../assets/more.png';
import voiceIcon from '../../assets/voice-search.png';
import notificationIcon from '../../assets/notification.png';
import profileIcon from '../../assets/jack.png';
import { Link } from 'react-router-dom';

export default function Navbar ({ setSidebar }) {
   return (
      <nav className='flex-div'>
         <div className="nav-left flex-div">
            <img src={ menu_icon } alt=""
               className='menu-icon'
               onClick={ () => setSidebar(prev => prev === false ? true : false) }
            />
            <Link to='/'><img src={ logo } alt="" className="logo" /></Link>
         </div>
         <div className="nav-middle flex-div">
            <div className="search-box">
               <input type="text" placeholder='Search' />
               <img src={ searchIcon } alt="" />
            </div>
            <div className="search-voice">
               <img src={ voiceIcon } alt="" title='search with voice' />
            </div>
         </div>

         <div className="nav-right flex-div">
            <img src={ uploadIcon } alt="" title='upload' />
            <img src={ moreIcon } alt="" title='more' />
            <img src={ notificationIcon } alt="" title='notification' />
            <img src={ profileIcon } alt="" className='user-icon' />
         </div>
      </nav>
   );
}
