import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import API from '../utils/api';

const VideoPage = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await API.get(`/videos/${id}`);
        setVideo(response.data);
      } catch (err) {
        setError('Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!video) return <div>Video not found</div>;

  return (
    <div className="video-page">
      <div className="video-player-container">
        <ReactPlayer
          url={video.url}
          controls
          width="100%"
          height="100%"
        />
      </div>
      <div className="video-details">
        <h1>{video.title}</h1>
        <div className="video-tags">
          {video.hashtags?.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;