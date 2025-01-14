import React, { useEffect, useState } from 'react';
import './Recommended.css';
import { API_KEY, viewsValueConverter } from '../../data';
import { Link } from 'react-router-dom';

export default function Recommended ({ categoryId }) {
   const [apiData, setApiData] = useState([]);

   const fetchRelatedVideos = async () => {

      try {
         const relatedVideoUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=45&regionCode=GH&videoCategoryId=${categoryId}&key=${API_KEY}`;

         const response = await fetch(relatedVideoUrl);
         const data = await response.json();
         setApiData(data.items);
      } catch (error) {
         console.error("Error fetching related videos:", error);
      }
   };

   useEffect(() => {
      fetchRelatedVideos();
   }, []);


   return (
      <div className='recommended'>
         { apiData.map((item, index) => (
            <Link to={ `/video/${item.id}/${item.snippet.categoryId}` } className="side-video-list" key={ index }>
               <img src={ item.snippet.thumbnails.medium.url } alt="" />
               <div className="vid-info">
                  <h4>{ item.snippet.title }</h4>
                  <p>{ item.snippet.channelTitle }</p>
                  <p>{ viewsValueConverter(item.statistics.viewCount) } views</p>
               </div>
            </Link>
         )) }
      </div>
   );
}
