import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { Save, Image as ImageIcon } from 'lucide-react';

export function WriteBlog() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [excerpt, setExcerpt] = useState('');
    // TODO: Add category selection when UI is ready
    const [image, setImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('excerpt', excerpt);
            // formData.append('category', category); // TODO: Handle category selection (ID or Slug)
            if (image) {
                formData.append('featured_image', image);
            }
            formData.append('status', 'published'); // Or 'draft' based on user choice

            await api.post('/api/posts/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            navigate('/admin/dashboard');
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-[#3C2415]">Write New Blog</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2691E] focus:border-transparent"
                        placeholder="Enter post title"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                    <textarea
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D2691E] focus:border-transparent h-24"
                        placeholder="Short summary of the post"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image</label>
                    <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImageIcon className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="text-sm text-gray-500">
                                    {image ? image.name : 'Click to upload image'}
                                </p>
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => setImage(e.target.files?.[0] || null)}
                                accept="image/*"
                            />
                        </label>
                    </div>
                </div>

                <div className="h-96 mb-12">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                    <ReactQuill
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        className="h-80"
                    />
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center gap-2 bg-[#D2691E] text-white px-6 py-3 rounded-lg hover:bg-[#B85C1B] transition-colors disabled:opacity-50"
                    >
                        <Save className="h-5 w-5" />
                        {isSubmitting ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}
