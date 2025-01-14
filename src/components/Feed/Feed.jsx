import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_KEY, viewsValueConverter } from '../../data.js';
import moment from 'moment';
import './Feed.css';

function Feed ({ category }) {
   const [data, setData] = useState([]);

   const fetchData = async () => {
      const videoListUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=150&regionCode=GH&videoCategoryId=${category}&key=${API_KEY}`;

      await fetch(videoListUrl)
         .then(response => response.json())
         .then(data => setData(data.items))
         .catch(error => console.log(error));
   };

   useEffect(() => {
      fetchData();
   }, [category]);

   return (
      <div className="feed">
         { data.map((item, index) => (
            <Link to={ `/video/${item.id}/${item.snippet.categoryId}` } className='card' key={ index }>
               <img src={ item.snippet.thumbnails.medium.url } alt="" />
               <h2>{ item.snippet.title }</h2>
               <h3>{ item.snippet.channelTitle }</h3>
               <p>{ viewsValueConverter(item.statistics.viewCount) } views &bull; { moment(item.snippet.publishedAt).fromNow() }</p>
            </Link>
         )) }
      </div>

   );
}

export default Feed;
