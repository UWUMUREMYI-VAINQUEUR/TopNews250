import React, { useState, useEffect, useContext } from "react";
import {
  createPost,
  uploadImage,
  uploadVideo,
  fetchCategories,
  fetchTags,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [snippet, setSnippet] = useState("");
  const [body, setBody] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, tagRes] = await Promise.all([
          fetchCategories(),
          fetchTags(),
        ]);
        setCategories(catRes.data || []);
        setTags(tagRes.data || []);
      } catch (err) {
        console.error("Failed to load categories/tags", err);
      }
    };
    loadData();
  }, []);

  /* ================= FILE UPLOAD ================= */
  const handleUploadFile = (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (type === "image") {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
      }
    };

    input.click();
  };

  /* ================= TAGS ================= */
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setSelectedTags((prev) => [...new Set([...prev, tagInput.trim()])]);
    setTagInput("");
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  /* ================= UPLOAD HELPERS ================= */
  const handleUpload = async (file, type) => {
    if (!file) return null;

    const fd = new FormData();
    fd.append(type, file);

    try {
      const res =
        type === "image"
          ? await uploadImage(fd)
          : await uploadVideo(fd);

      return res.data.filePath || null;
    } catch (err) {
      console.error(`${type} upload failed`, err);
      throw new Error(`${type} upload failed`);
    }
  };

  /* ================= SUBMIT POST ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login first");
      return;
    }

    if (!title || !body) {
      setError("Title and body are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const uploadedImageUrl = await handleUpload(imageFile, "image");
      const uploadedVideoUrl = await handleUpload(videoFile, "video");

      const payload = {
        title,
        snippet,
        body,
        image_url: uploadedImageUrl || null,
        video_url: uploadedVideoUrl || null,
        category_id: categoryId || null,
        tags: selectedTags,
      };

      const res = await createPost(payload);

      /* ================= SUCCESS MESSAGE ================= */
      setSuccessMsg(
        "Your post has been submitted successfully.\n\n" +
        "It is now under review by our team.\n" +
        "Once approved, it will appear on TopNews.\n\n" +
        "Thank you for following our community guidelines."
      );

      /* ================= RESET FORM ================= */
      setTitle("");
      setSnippet("");
      setBody("");
      setImageFile(null);
      setImagePreview("");
      setVideoFile(null);
      setVideoPreview("");
      setSelectedTags([]);
      setCategoryId("");

      /* optional: go home */
      setTimeout(() => navigate("/"), 2000);

    } catch (err) {
      console.error(err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">

      <h1 className="text-3xl font-bold text-center">
        Create New Post
      </h1>

      {/* SUCCESS MESSAGE */}
      {successMsg && (
        <div className="p-4 bg-green-100 text-green-800 rounded-lg whitespace-pre-line">
          {successMsg}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="text-red-600 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="w-full p-3 border rounded-lg"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="w-full p-3 border rounded-lg"
          placeholder="Snippet"
          value={snippet}
          onChange={(e) => setSnippet(e.target.value)}
        />

        {/* CATEGORY */}
        <select
          className="w-full p-3 bg-black border rounded-lg"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* TAGS */}
        <div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 p-2 border rounded-lg"
              placeholder="Add tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-3 bg-gray-200 rounded-lg"
            >
              Add
            </button>
          </div>

          <div className="flex gap-2 flex-wrap mt-2">
            {selectedTags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(t)}
                  className="text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* BODY */}
        <textarea
          className="w-full p-3 border rounded-lg"
          rows="10"
          placeholder="Full content"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />

        {/* IMAGE */}
        <div>
          <button
            type="button"
            onClick={() => handleUploadFile("image")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Upload Image
          </button>

          {imagePreview ? (
            <img
              src={imagePreview}
              className="mt-2 w-full max-h-64 object-cover rounded-lg"
            />
          ) : null}
        </div>

        {/* VIDEO */}
        <div>
          <button
            type="button"
            onClick={() => handleUploadFile("video")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Upload Video
          </button>

          {videoPreview ? (
            <video
              controls
              src={videoPreview}
              className="mt-2 w-full max-h-64 rounded-lg"
            />
          ) : null}
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Publishing..." : "Publish Post"}
        </button>

      </form>
    </div>
  );
}