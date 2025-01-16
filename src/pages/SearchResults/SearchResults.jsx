import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './SearchResults.css';
import { API_KEY, viewsValueConverter } from '../../data';
import Loader from '../../components/Loader/Loader';
import moment from 'moment';

export default function SearchResults ({ categoryId }) {
   const { searchTerm } = useParams();
   const [results, setResults] = useState([]);
   const [loading, setLoading] = useState(false);
   const [nextPageToken, setNextPageToken] = useState(null);
   const [channelsInfo, setChannelsInfo] = useState({});

   // Fetch search results based on the search term and nextPageToken
   const fetchSearchResults = async (pageToken = '') => {
      setLoading(true);
      try {
         const searchUrl = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${searchTerm}&pageToken=${pageToken}&key=${API_KEY}`;
         const response = await fetch(searchUrl);
         const data = await response.json();

         setResults(prevResults => [...prevResults, ...data.items]);
         setNextPageToken(data.nextPageToken);

         // Fetch channel details (profile picture, view count) for each result
         const channelIds = data.items.map(item => item.snippet.channelId);
         const channelInfoUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds.join(',')}&key=${API_KEY}`;
         const channelResponse = await fetch(channelInfoUrl);
         const channelData = await channelResponse.json();

         // Map channel details with results
         const channelInfo = {};
         channelData.items.forEach(channel => {
            channelInfo[channel.id] = {
               profileImageUrl: channel.snippet.thumbnails.default.url,
               viewCount: channel.statistics.viewCount,
            };
         });
         setChannelsInfo(prevInfo => ({ ...prevInfo, ...channelInfo }));
      } catch (error) {
         console.error('Error fetching search results or channel details:', error);
      } finally {
         setLoading(false);
      }
   };

   // Initial Fetch
   useEffect(() => {
      // Clear previous results on new search
      setResults([]);
      fetchSearchResults();
   }, [searchTerm]);

   // Infinite Scroll Logic
   useEffect(() => {
      const handleScroll = () => {
         if (
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
            !loading &&
            nextPageToken
         ) {
            fetchSearchResults(nextPageToken);
         }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, [loading, nextPageToken]);

   return (
      <div className="search-results">
         { loading && results.length === 0 && <Loader /> }
         { results.length === 0 && !loading && <p>No results found.</p> }
         <div className="results-list">
            { results.map((result, index) => (
               <Link
                  to={ `/video/${result.id.videoId}/${categoryId}` }
                  className="result-card"
                  key={ index }
               >
                  <img
                     src={ result.snippet.thumbnails.medium.url }
                     alt={ result.snippet.title }
                  />
                  <div className="result-info">
                     <h4>{ result.snippet.title }</h4>
                     <p>{ result.snippet.channelTitle }</p>
                     <div className="channel-info">
                        <span>
                           { viewsValueConverter(channelsInfo[result.snippet.channelId]?.viewCount) } views &bull;{ ' ' }
                           { moment(result.snippet.publishedAt).fromNow() }
                        </span>
                     </div>
                  </div>
               </Link>
            )) }
         </div>
         { loading && results.length > 0 && <Loader /> }
      </div>
   );
}
