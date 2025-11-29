import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Send, User, PenTool, Clock } from 'lucide-react';
import { BlogPost, Comment, User as UserType } from '../types';
import { db } from '../services/db';

interface BlogProps {
  currentUser: UserType | null;
}

export const Blog: React.FC<BlogProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [customName, setCustomName] = useState('');
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Reset anonymity preference based on login state
  useEffect(() => {
    if (currentUser) {
      setIsAnonymous(false);
    }
  }, [currentUser]);

  // Load posts from "backend" on mount
  useEffect(() => {
    const loadPosts = async () => {
        const fetchedPosts = await db.getPosts();
        setPosts(fetchedPosts);
    };
    loadPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    // Determine author name
    let authorName = 'Anonymous';
    if (!isAnonymous) {
      authorName = currentUser ? currentUser.name : (customName.trim() || 'Community Member');
    }

    const newPost: BlogPost = {
      id: Date.now().toString(), // Backend usually overwrites this
      author: authorName,
      content: newPostContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    // Save to DB and update state
    const updatedPosts = await db.addPost(newPost);
    setPosts(updatedPosts);
    setNewPostContent('');
  };

  const handleLike = async (postId: string) => {
    const updatedPosts = await db.toggleLike(postId);
    setPosts(updatedPosts);
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: currentUser ? currentUser.name : 'You',
      content: text,
      timestamp: new Date().toISOString()
    };

    const updatedPosts = await db.addComment(postId, newComment);
    setPosts(updatedPosts);
    
    setCommentInputs({ ...commentInputs, [postId]: '' });
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        return timestamp; // Return original string if it's not a valid date
    }
    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Voices</h1>
        <p className="text-gray-600 dark:text-gray-400">Share your story, find support, and connect with others.</p>
      </div>

      {/* Create Post */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-100 dark:border-gray-700 transition-all hover:shadow-lg">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <PenTool size={18} className="text-indigo-600 dark:text-indigo-400"/>
          Share your thoughts
        </h3>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          className="w-full border border-gray-200 dark:border-gray-600 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white dark:placeholder-gray-400"
          placeholder={`Write something supportive, ${currentUser ? currentUser.name.split(' ')[0] : 'friend'}...`}
          rows={3}
        />
        
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          
          {/* Identity Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto bg-gray-50 dark:bg-gray-700 p-2 rounded-lg border border-gray-100 dark:border-gray-600">
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors select-none">
              <div className="relative flex items-center">
                 <input 
                   type="checkbox" 
                   checked={isAnonymous} 
                   onChange={(e) => setIsAnonymous(e.target.checked)} 
                   className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-500 transition-all checked:border-indigo-600 checked:bg-indigo-600"
                 />
                 <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                 </span>
              </div>
              Post Anonymously
            </label>

            {!isAnonymous && (
              <div className="flex items-center gap-2 animate-in slide-in-from-left-2 fade-in duration-200">
                {currentUser ? (
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800">
                        Posting as {currentUser.name}
                    </span>
                ) : (
                    <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Enter Name"
                        className="flex-1 min-w-[120px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500 text-gray-900 dark:text-white"
                        maxLength={20}
                    />
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleCreatePost}
            disabled={!newPostContent.trim()}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send size={16} />
            Post
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors">
            <div className="p-6">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${post.author === 'Anonymous' ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'}`}>
                  {post.author === 'Anonymous' ? <User size={20} /> : <span className="font-bold text-lg">{post.author[0]}</span>}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">{post.author}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                    <Clock size={12} className="inline" />
                    {formatTimestamp(post.timestamp)}
                  </p>
                </div>
              </div>

              {/* Content */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap">
                {post.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-6 border-t border-gray-100 dark:border-gray-700 pt-4">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors group"
                >
                  <Heart size={20} className="group-hover:fill-red-500" />
                  <span className="text-sm font-medium">{post.likes} Likes</span>
                </button>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                  <MessageSquare size={20} />
                  <span className="text-sm font-medium">{post.comments.length} Comments</span>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-100 dark:border-gray-700">
              <div className="space-y-4 mb-4">
                {post.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                      <User size={14} />
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-700 flex-1">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                           {formatTimestamp(comment.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="relative">
                <input
                  type="text"
                  value={commentInputs[post.id] || ''}
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  placeholder={currentUser ? "Write a comment..." : "Write a comment as Guest..."}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:placeholder-gray-400"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900 p-1.5 rounded-full transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};