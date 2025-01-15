import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_KEY, viewsValueConverter } from '../../data';
import moment from 'moment';
import Loader from '../Loader/Loader';
import './Feed.css';

function Feed ({ category }) {
   const [data, setData] = useState([]);
   const [nextPageToken, setNextPageToken] = useState(null);
   const [loading, setLoading] = useState(false);

   const fetchData = async (pageToken = '') => {
      // Prevent duplicate requests
      if (loading) return;
      setLoading(true);

      try {
         const videoListUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=20&regionCode=GH&videoCategoryId=${category}&key=${API_KEY}&pageToken=${pageToken}`;
         const response = await fetch(videoListUrl);
         const result = await response.json();

         setData((prevData) => [...prevData, ...result.items]);
         // Update nextPageToken
         setNextPageToken(result.nextPageToken || null);
      } catch (error) {
         console.error('Error fetching data:', error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      setData([]); // Clear previous data
      setNextPageToken(null); // Reset nextPageToken
      fetchData(); // Fetch the first page of data
   }, [category]); // Re-run when category changes

   useEffect(() => {
      const handleScroll = () => {
         const nearBottom =
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 500;

         if (nearBottom && nextPageToken && !loading) {
            // Fetch the next page of data
            fetchData(nextPageToken);
         }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
      // Re-run when nextPageToken or loading changes
   }, [nextPageToken, loading]);

   return (
      <div className="feed">
         { data.map((item, index) => (
            <Link
               to={ `/video/${item.id}/${item.snippet.categoryId}` }
               className="card"
               key={ index }
            >
               <img src={ item.snippet.thumbnails.medium.url } alt="" />
               <h2>{ item.snippet.title }</h2>
               <h3>{ item.snippet.channelTitle }</h3>
               <p>
                  { viewsValueConverter(item.statistics.viewCount) } views &bull;{ ' ' }
                  { moment(item.snippet.publishedAt).fromNow() }
               </p>
            </Link>
         )) }
         { loading && <Loader /> }
      </div>
   );
}

export default Feed;