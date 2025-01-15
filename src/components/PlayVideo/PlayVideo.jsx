import React, { useEffect, useState } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { API_KEY, viewsValueConverter, formatDescription } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import Loader from '../Loader/Loader';

export default function PlayVideo () {
   const { videoId } = useParams();

   const [apiData, setApiData] = useState(null);
   const [channelData, setChannelData] = useState(null);
   const [comments, setComments] = useState([]);
   const [nextPageToken, setNextPageToken] = useState(null);
   const [loading, setLoading] = useState(false);
   const [showFullDescription, setShowFullDescription] = useState(false);

   const toggleDescription = () => {
      setShowFullDescription(!showFullDescription);
   };

   // Fetch video details
   const fetchVideoData = async () => {
      const videoDetailsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
      await fetch(videoDetailsUrl)
         .then(response => response.json())
         .then(data => setApiData(data.items[0]))
         .catch(error => console.log(error));
   };

   // Fetch channel details and initial comments
   const fetchOtherData = async () => {
      if (!apiData?.snippet?.channelId) return;

      try {
         const channelDataUrl = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
         const channelResponse = await fetch(channelDataUrl);
         const channelData = await channelResponse.json();
         setChannelData(channelData.items[0]);

         fetchComments(); // Initial fetch of comments
      } catch (error) {
         console.error("Error fetching data:", error);
      }
   };

   // Fetch comments
   const fetchComments = async (pageToken = '') => {
      if (loading) return;
      setLoading(true);

      try {
         const commentUrl = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&videoId=${videoId}&key=${API_KEY}&pageToken=${pageToken}`;
         const response = await fetch(commentUrl);
         const data = await response.json();

         setComments((prev) => [...prev, ...data.items]);
         setNextPageToken(data.nextPageToken || null);
      } catch (error) {
         console.error("Error fetching comments:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchVideoData();
   }, [videoId]);

   useEffect(() => {
      if (apiData) fetchOtherData();
   }, [apiData]);

   useEffect(() => {
      const handleScroll = () => {
         const container = document.querySelector('.play-video');
         if (!container) return;
         const nearBottom =
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 500;

         if (nearBottom && nextPageToken && !loading) {
            fetchComments(nextPageToken);
         }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, [nextPageToken, loading]);

   return (
      <div className='play-video'>
         <iframe
            src={ `https://www.youtube.com/embed/${videoId}?autoplay=1` }
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
         ></iframe>
         <h3>{ apiData ? apiData.snippet.title : "Title Here" }</h3>
         <div className="play-video-info">
            <p>{ apiData ? viewsValueConverter(apiData.statistics.viewCount) : "No" } views &bull; { apiData ? moment(apiData.snippet.publishedAt).fromNow() : "" }</p>
            <div>
               <span><img src={ like } alt="" />{ apiData ? viewsValueConverter(apiData.statistics.likeCount) : "" }</span>
               <span><img src={ dislike } alt="" />{ apiData ? viewsValueConverter(apiData.statistics.disLikeCount) : 0 }</span>
               <span><img src={ share } alt="" />Share</span>
               <span><img src={ save } alt="" />Save</span>
            </div>
         </div>
         <hr />
         <div className="publisher">
            <img src={ channelData ? channelData.snippet.thumbnails.default.url : "" } alt="" />
            <div>
               <p>{ apiData ? apiData.snippet.channelTitle : "Channel Title Here" }</p>
               <span>{ channelData ? viewsValueConverter(channelData.statistics.subscriberCount) : "" } subscribers</span>
            </div>
            <button>Subscribe</button>
         </div>
         <div className="vid-description">
            <p>
               { apiData
                  ? showFullDescription
                     ? formatDescription(apiData.snippet.description)
                     : formatDescription(`${apiData.snippet.description.slice(0, 250)}...`)
                  : "Description Here"
               }
               { apiData?.snippet.description.length > 250 && (
                  <span onClick={ toggleDescription }>
                     { showFullDescription ? "Show Less" : "Show More" }
                  </span>
               ) }
            </p>
            <hr />
            <h3>{ apiData ? viewsValueConverter(apiData.statistics.commentCount) : 0 } comments</h3>
            { comments.map((item, index) => (
               <div className="comment" key={ index }>
                  <img src={ item.snippet.topLevelComment.snippet.authorProfileImageUrl } alt="" />
                  <div>
                     <h3>{ item.snippet.topLevelComment.snippet.authorDisplayName } <span>{ moment(item.snippet.topLevelComment.publishedAt).fromNow() }</span></h3>
                     <p>{ item.snippet.topLevelComment.snippet.textDisplay }</p>
                     <div className="comment-action">
                        <img src={ like } alt="" /> <span>{ viewsValueConverter(item.snippet.topLevelComment.snippet.likeCount) }</span>
                        <img src={ dislike } alt="" /> <span>{ item ? item.snippet.topLevelComment.snippet.disLikeCount : "" }</span>
                     </div>
                  </div>
               </div>
            )) }
            { loading && <Loader /> }
         </div>
      </div>
   );
}
