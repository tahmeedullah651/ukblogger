import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import API from "../utils/api";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    title: "",
    hashtags: "",
    videoFile: null,
  });
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [comments, setComments] = useState([]);
  // const [showComments, setShowComments] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchComments = async (videoId) => {
    try {
      const response = await API.get(`/video/comment/${videoId}`);
      const data = response.data;
      console.log(response);

      console.log(data);

      setComments((prev) => ({
        ...prev,
        [videoId]: data, // Store comments for the specific video
      }));
      console.log(comments);

      setActiveVideoId(videoId); // Set the active video
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleCommentClick = (e) => {
    const videoCard = e.target.closest(".video-card");
    const videoId = videoCard ? videoCard.getAttribute("data-video-id") : null;
    if (!videoId) {
      console.error("Video ID not found");
      return;
    }
    try {
      if (activeVideoId === videoId) {
        // If the same video is clicked again, toggle off
        setActiveVideoId(null);
      } else {
        fetchComments(videoId); // Fetch comments for the clicked video
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };
  const fetchVideos = async () => {
    try {
      const response = await API.get(`/video/getadminvideos/${user._id}`);
      setVideos(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch videos");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setFormData((prev) => ({
        ...prev,
        videoFile: file,
      }));
      setError("");
    } else {
      setError("Please select a valid video file");
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadStatus("uploading");
    setError("");

    if (!formData.title || !formData.hashtags || !formData.videoFile) {
      setError("Please fill in all fields");
      setUploadStatus("");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("hashtags", formData.hashtags);
    form.append("video", formData.videoFile);

    try {
      await API.post("/video/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setFormData({
        title: "",
        hashtags: "",
        videoFile: null,
      });
      setUploadStatus("success");
      fetchVideos();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload video");
      setUploadStatus("error");
    }
  };

  const handleDelete = async (e) => {
    const videoCard = e.target.closest(".video-card");
    const videoId = videoCard ? videoCard.getAttribute("data-video-id") : null;
    console.log(`the video id ${videoId}`);

    if (!videoId) {
      console.error("Video ID not found");
      return;
    }

    try {
      await API.delete(`/video/delete/${videoId}`);
      fetchVideos();
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <div className="upload-section">
        <h2>Upload New Video</h2>
        <form
          onSubmit={handleSubmit}
          className="upload-form"
          encType="multipart/form-data"
        >
          <div className="form-group">
            <label htmlFor="title">Video Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter video title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="hashtags">Hashtags</label>
            <input
              type="text"
              id="hashtags"
              name="hashtags"
              value={formData.hashtags}
              onChange={handleInputChange}
              placeholder="Enter hashtags (comma separated)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="video">Video File</label>
            <input
              type="file"
              id="video"
              accept="video/*"
              onChange={handleFileChange}
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {uploadStatus === "success" && (
            <div className="success-message">Video uploaded successfully!</div>
          )}

          <button
            type="submit"
            disabled={uploadStatus === "uploading"}
            className={uploadStatus === "uploading" ? "uploading" : ""}
          >
            {uploadStatus === "uploading" ? "Uploading..." : "Upload Video"}
          </button>
        </form>
      </div>

      <div className="videos-section">
        <h2>Your Videos</h2>
        <div className="admin-videos-grid">
          {videos.map((video) => (
            <div
              key={video._id}
              className="video-card"
              data-video-id={video._id}
            >
              <div className="video-player">
                <ReactPlayer
                  url={video.videoUrl}
                  controls
                  width="100%"
                  height="100%"
                />
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <p className="likes">
                  <span>Likes:</span>
                  {video.likes}
                </p>
                <div className="video-tags">
                  {video.hashtags.map((tag, index) => (
                    <span key={index} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="comments-btn" onClick={handleCommentClick}>
                <p >
                  {activeVideoId === video._id
                    ? "Hide Comments"
                    : "See Comments"}
                </p>
              </div>
              <div className="del-btn" onClick={handleDelete}>
                <p >Delete</p>
              </div>
              {activeVideoId === video._id && (
                <div className="comments-list">
                  {comments[video._id]?.length > 0 ? (
                    comments[video._id].map((comment) => (
                      <div key={comment._id} className="comment">
                        <p>
                          <strong>
                            {comment.user?.userName || "Anonymous"}:
                          </strong>{" "}
                          {comment.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No comments yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
