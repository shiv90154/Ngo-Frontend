"use client";

import { useState, useRef } from 'react';
import { Image, X, Loader2 } from 'lucide-react';
import api from '@/config/api';

export default function CreatePost({ onPostCreated }) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleMediaUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const uploadedMedia = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('media', file);
      try {
        const res = await api.post('/social/upload', formData);
        uploadedMedia.push({ url: res.data.data.url, type: 'image' });
      } catch (err) {
        console.error('Upload failed:', err);
      }
    }

    setMedia([...media, ...uploadedMedia]);
    setUploading(false);
  };

  const removeMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) return;

    try {
      const formData = new FormData();
      formData.append('content', content);
      media.forEach(m => formData.append('mediaUrls', JSON.stringify(m)));

      const res = await api.post('/social/posts', { content, media });
      setContent('');
      setMedia([]);
      onPostCreated?.(res.data.data);
    } catch (err) {
      console.error('Post creation failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0" />
        <div className="flex-1">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Media Preview */}
      {media.length > 0 && (
        <div className="flex gap-2 mt-3">
          {media.map((m, idx) => (
            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden">
              <img src={m.url} alt="Preview" className="w-full h-full object-cover" />
              <button onClick={() => removeMedia(idx)} className="absolute top-1 right-1 bg-black/50 rounded-full p-0.5">
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t">
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm"
        >
          <Image size={18} /> {uploading ? <Loader2 className="animate-spin" size={16} /> : 'Add Image'}
        </button>
        <button
          onClick={handleSubmit}
          disabled={(!content.trim() && media.length === 0) || uploading}
          className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          Post
        </button>
      </div>
      <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleMediaUpload} />
    </div>
  );
}