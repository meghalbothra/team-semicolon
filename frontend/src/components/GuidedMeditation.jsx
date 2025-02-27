import React, { useEffect, useState } from 'react';

const GuidedMeditation = () => {
  const [videos, setVideos] = useState([]);
  const [visibleVideos, setVisibleVideos] = useState(6);
  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY; // Loaded from .env
  const searchQuery = 'guided meditation';
  const totalResults = 30;
  
  useEffect(() => {
    if (!API_KEY) {
      console.error('API Key is missing! Please set REACT_APP_YOUTUBE_API_KEY in your .env file.');
      return;
    }
    fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${totalResults}&q=${searchQuery}&type=video&key=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.items) {
          setVideos(data.items);
        } else {
          console.error('No video items found in the response:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching videos:', error);
      });
  }, [API_KEY]);

  const showMoreVideos = () => {
    setVisibleVideos((prevVisible) => prevVisible + 3);
  };

  return (
    <div className="bg-white min-h-screen py-10">
      <h1 className="text-4xl font-extrabold text-purple-700 text-center mb-12 tracking-wide">
        Calm Corner - Find Your Calm with Guided Meditation
      </h1>
      <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Explore a collection of calming guided meditation videos designed to help you relax, focus, and find peace.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto px-4">
        {videos.slice(0, visibleVideos).map((video) => (
          <div
            key={video.id.videoId}
            className="bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl hover:bg-purple-50 cursor-pointer overflow-hidden"
          >
            <a
              href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                className="rounded-t-lg w-full h-48 object-cover"
                src={video.snippet.thumbnails.high.url}
                alt={video.snippet.title}
              />
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-purple-900 mb-2 truncate">
                  {video.snippet.title}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  {video.snippet.channelTitle}
                </p>
                <p className="text-gray-600 text-sm">
                  {video.snippet.description?.slice(0, 100) || ""}...
                </p>
              </div>
            </a>
          </div>
        ))}
      </div>

      {visibleVideos < videos.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={showMoreVideos}
            className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-purple-700 shadow-md transition-colors"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default GuidedMeditation;
