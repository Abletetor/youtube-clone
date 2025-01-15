import React, { useEffect, useState } from 'react';
import './Recommended.css';
import { API_KEY, viewsValueConverter } from '../../data';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';

export default function Recommended ({ categoryId }) {
   const [apiData, setApiData] = useState([]);
   const [nextPageToken, setNextPageToken] = useState(null);
   const [loading, setLoading] = useState(false);

   const fetchRelatedVideos = async (pageToken = '') => {
      if (loading) return; // Prevent multiple fetches
      setLoading(true);

      try {
         const relatedVideoUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20&regionCode=GH&videoCategoryId=${categoryId}&key=${API_KEY}&pageToken=${pageToken}`;
         const response = await fetch(relatedVideoUrl);
         const data = await response.json();

         setApiData((prevData) => [...prevData, ...data.items]);
         setNextPageToken(data.nextPageToken || null);
      } catch (error) {
         console.error('Error fetching related videos:', error);
      } finally {
         setLoading(false);
      }
   };

   // Fetch the first set of videos when the component mounts 
   // or categoryId changes
   useEffect(() => {
      setApiData([]); // Clear previous data
      setNextPageToken(null); // Reset nextPageToken
      fetchRelatedVideos();
   }, [categoryId]);


   useEffect(() => {
      const handleScroll = () => {
         const container = document.querySelector('.recommended');
         if (!container) return;

         const nearBottom =
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 500;

         if (nearBottom && nextPageToken && !loading) {
            fetchRelatedVideos(nextPageToken);
         }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
      // Re-run when nextPageToken or loading changes
   }, [nextPageToken, loading]);

   return (
      <div className="recommended">
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
         { loading && <Loader /> }
      </div>
   );
}
