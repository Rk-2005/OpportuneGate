import React, { useState } from 'react';
import { 
  CalendarIcon, 
  ChatBubbleLeftIcon, 
  EyeIcon, 
  BookmarkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import Navbar from './Navbar';

// Mock blog data
const initialBlogs = [
  {
    id: 1,
    title: "Amazon Interview Experience - SDE 1 (2024)",
    author: "Raj Sharma",
    authorRole: "Software Engineer @ Amazon",
    timestamp: "2 hours ago",
    content: "Just cleared my Amazon SDE 1 interview! The process consisted of 4 rounds: 2 coding, 1 system design, and 1 behavioral. Key topics: Dynamic Programming, OOD principles, and leadership principles...",
    tags: ["amazon", "interview", "sde", "experience"],
    views: "20.7K",
    comments: 47,
    likes: 114,
    isBookmarked: false,
    isTrending: true
  },
  {
    id: 2,
    title: "Google Hiring Process - What to Expect in 2024",
    author: "Priya Patel",
    authorRole: "Senior Engineer @ Google",
    timestamp: "5 hours ago",
    content: "Google's hiring process has evolved significantly this year. They're focusing more on practical problem-solving and system design. Here's a breakdown of what to expect...",
    tags: ["google", "hiring", "process", "tech"],
    views: "15.2K",
    comments: 32,
    likes: 89,
    isBookmarked: true,
    isTrending: true
  },
  {
    id: 3,
    title: "System Design: Building a Scalable Chat Application",
    author: "Amit Kumar",
    authorRole: "Principal Engineer @ Microsoft",
    timestamp: "1 day ago",
    content: "In this comprehensive guide, we'll design a WhatsApp-like chat application that can handle millions of concurrent users. We'll cover WebSockets, message queues, database sharding...",
    tags: ["system-design", "scalability", "backend", "tutorial"],
    views: "8.4K",
    comments: 21,
    likes: 67,
    isBookmarked: false,
    isTrending: false
  },
  {
    id: 4,
    title: "FAANG Preparation Strategy - 3 Month Plan",
    author: "Neha Gupta",
    authorRole: "Ex-Meta, Now Founder",
    timestamp: "2 days ago",
    content: "After helping 100+ students land jobs at FAANG companies, I've created this optimized 3-month preparation plan. Focus on DSA, system design, and behavioral questions...",
    tags: ["faang", "preparation", "study-plan", "career"],
    views: "12.8K",
    comments: 45,
    likes: 123,
    isBookmarked: false,
    isTrending: true
  },
  {
    id: 5,
    title: "Remote Work in Tech: LATAM Opportunities Growing",
    author: "Carlos Rodriguez",
    authorRole: "Tech Recruiter @ Startup",
    timestamp: "3 days ago",
    content: "Noticed a significant increase in remote positions targeting LATAM region. Companies are expanding their talent search beyond traditional markets. Here's what you need to know...",
    tags: ["remote", "latam", "hiring", "trends"],
    views: "5.6K",
    comments: 18,
    likes: 42,
    isBookmarked: false,
    isTrending: false
  },
  {
    id: 6,
    title: "Behavioral Questions That Actually Matter in 2024",
    author: "Sarah Chen",
    authorRole: "Engineering Manager @ Netflix",
    timestamp: "4 days ago",
    content: "Beyond the standard 'tell me about yourself', companies are now asking more situational and cultural fit questions. Here are the top 15 behavioral questions you should prepare for...",
    tags: ["behavioral", "interview", "career", "soft-skills"],
    views: "7.9K",
    comments: 29,
    likes: 78,
    isBookmarked: true,
    isTrending: false
  }
];

function Blog() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const allTags = ['all', ...new Set(blogs.flatMap(blog => blog.tags))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || blog.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const toggleBookmark = (blogId) => {
    setBlogs(blogs.map(blog => 
      blog.id === blogId ? { ...blog, isBookmarked: !blog.isBookmarked } : blog
    ));
  };

  const trendingBlogs = blogs.filter(blog => blog.isTrending);

  return (
    <>
    <Navbar></Navbar>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="p-4">
  <a
    href="/"
    className="inline-block px-4 py-2 text-blue-500 bg-slate-100  rounded-lg shadow-md hover:bg-slate-100 hover:shadow-lg transition-all duration-200"
  >
    ← Go Back
  </a>
</div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Career Insights & Community Discussions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join the conversation with students, professionals, and recruiters. Share experiences, learn from others, and grow together.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Create */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search discussions, topics, or users..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors">
                  <PlusIcon className="w-5 h-5" />
                  New Post
                </button>
              </div>

              {/* Tags Filter */}
              <div className="flex flex-wrap gap-2 mt-4">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedTag === tag
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Blog List */}
            <div className="space-y-4">
              {filteredBlogs.map(blog => (
                <div key={blog.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {blog.author.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{blog.author}</h3>
                        <p className="text-sm text-gray-500">{blog.authorRole}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-4 h-4" />
                        {blog.timestamp}
                      </span>
                      <button
                        onClick={() => toggleBookmark(blog.id)}
                        className="p-1 hover:text-blue-600 transition-colors"
                      >
                        {blog.isBookmarked ? (
                          <BookmarkSolid className="w-5 h-5 text-blue-600" />
                        ) : (
                          <BookmarkIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.content}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <EyeIcon className="w-4 h-4" />
                        {blog.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ChatBubbleLeftIcon className="w-4 h-4" />
                        {blog.comments} comments
                      </span>
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <FireIcon className="w-4 h-4" />
                        {blog.likes} likes
                      </span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Posts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FireIcon className="w-5 h-5 text-orange-500" />
                Trending Discussions
              </h3>
              <div className="space-y-4">
                {trendingBlogs.map(blog => (
                  <div key={blog.id} className="border-l-4 border-orange-500 pl-4 py-1">
                    <h4 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors">
                      {blog.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <span>{blog.views}</span>
                      <span>•</span>
                      <span>{blog.comments} comments</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Community Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Posts</span>
                  <span className="font-bold">2,847</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Users</span>
                  <span className="font-bold">15.2K</span>
                </div>
                <div className="flex justify-between">
                  <span>Companies Discussed</span>
                  <span className="font-bold">127</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Stories</span>
                  <span className="font-bold">892</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  📝 Share Interview Experience
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  💼 Ask Company Questions
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  🤝 Find Study Partners
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                  📊 Compare Offers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Blog;