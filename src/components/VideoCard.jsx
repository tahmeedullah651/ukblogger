import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa";
import { useState, useEffect } from "react";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const VideoCard = ({ video }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(video.likes); // Track likes separately
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [resVideo, setresVideo] = useState(video.likes)

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const response = await API.get(`/video/check-like/${video._id}/${user._id}`);
        setLiked(response.data.liked); // Set initial liked state
      } catch (err) {
        console.error("Error checking like status:", err);
      }
    };

    if (user) {
      fetchVideoData();
    }
  }, [video._id, user]);

  const handleLike = async () => {
    console.log(`The video ID is ${video._id}`);
  
    try {
      if (!liked) {
        // Like the video
        const response = await API.get(`/video/like/${video._id}/${user._id}`);
        setresVideo((prev) => ({ ...prev, likes: response.data.likes })); // Update likes
        setLiked(true);
      } else {
        // Unlike the video
        const response = await API.get(`/video/unlike/${video._id}/${user._id}`);
        setresVideo((prev) => ({ ...prev, likes: response.data.likes })); // Update likes
        setLiked(false);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };
  
  

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };
  
  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    try {
      const response = await API.post(`/video/comment/${video._id}`, {
        comment,
        user,
      });

      setComment(""); // Clear the comment input
      setComments(response.data.comments); // Update the comments list
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };

  const handleCommentClick = () => {
    setShowCommentInput(!showCommentInput);
    if (!showComments) {
      fetchComments(); // Fetch comments only if the section is not already open
    } else {
      setShowComments(false); // Close the comments section if it's already open
    }
  };
  
  const fetchComments = async () => {
    try {
      const response = await API.get(`/video/comment/${video._id}`);
      setComments(response.data); // Update the comments state
      setShowComments(true); // Ensure comments section is shown
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  return (
    <div className="card" data-video-id={video._id}>
      <div className="card-header">
        <p>{video.title}</p>
      </div>
      {/* Hashtags */}
      {video.hashtags.map((hashtag, index) => (
        <p key={index} className="card-des hashtags">
          {"#" + hashtag + " "}
        </p>
      ))}
      <div className="card-image-container">
        <video autoPlay loop muted>
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="reaction-btns">
        {/* Like Button */}
        <div className="like-btn btn" onClick={handleLike}>
          {liked ? (
            <FaHeart size={40} color="red" />
          ) : (
            <FaRegHeart size={40} color="white" />
          )}
          <p className="like-counts">{likes}</p>
        </div>

        {/* Comment Button */}
        <div className="comment-btn btn" onClick={handleCommentClick}>
          <FaRegComment size={40} />
        </div>
      </div>

      {/* Comment Input Section */}
      {showCommentInput && (
        <div className="comment-section">
          <div className="comment-input-container">
            <textarea
              type="text"
              className="text-area"
              value={comment}
              onChange={handleCommentChange}
              placeholder="Add a comment..."
            ></textarea>
            <button onClick={handleCommentSubmit} className="comment-btn">
              Comment
            </button>
          </div>
          <div className="comments-list">
            {comments?.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <p>
                    <strong>{comment.user?.userName || "Anonymous"}:</strong>{" "}
                    {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default VideoCard;
