'use client'

import { useState } from 'react'
import Link from 'next/link'

// Admin Dashboard Mockup for Blog Management
export default function BlogAdminDashboard() {
  const [activeTab, setActiveTab] = useState('posts')
  
  // Mock data for demonstration
  const mockStats = {
    totalPosts: 24,
    publishedPosts: 18,
    draftPosts: 6,
    totalViews: 15420,
    totalComments: 342,
    subscribers: 1250
  }
  
  const mockRecentPosts = [
    { id: 1, title: '10 Ways AI is Revolutionizing Customer Engagement', status: 'published', views: 2340, date: '2024-01-15' },
    { id: 2, title: 'The Complete Guide to Marketing Automation', status: 'published', views: 1890, date: '2024-01-10' },
    { id: 3, title: 'Scaling Your Business with Data-Driven Decisions', status: 'draft', views: 0, date: '2024-01-20' },
  ]
  
  const mockCategories = [
    { name: 'Marketing', slug: 'marketing', count: 8 },
    { name: 'Automation', slug: 'automation', count: 10 },
    { name: 'Growth', slug: 'growth', count: 6 }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">Blog Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/blog"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View Blog →
              </Link>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                New Post
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Posts</p>
            <p className="text-2xl font-bold text-gray-900">{mockStats.totalPosts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Published</p>
            <p className="text-2xl font-bold text-green-600">{mockStats.publishedPosts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Drafts</p>
            <p className="text-2xl font-bold text-yellow-600">{mockStats.draftPosts}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Total Views</p>
            <p className="text-2xl font-bold text-gray-900">{mockStats.totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Comments</p>
            <p className="text-2xl font-bold text-gray-900">{mockStats.totalComments}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-600">Subscribers</p>
            <p className="text-2xl font-bold text-purple-600">{mockStats.subscribers.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tabs */}
          <div className="border-b">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('posts')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'posts'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'categories'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Categories & Tags
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-purple-600 text-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Recent Posts</h2>
                  <div className="flex gap-2">
                    <input
                      type="search"
                      placeholder="Search posts..."
                      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                      <option>All Status</option>
                      <option>Published</option>
                      <option>Draft</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Title</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Views</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockRecentPosts.map(post => (
                        <tr key={post.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <p className="font-medium">{post.title}</p>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">{post.views.toLocaleString()}</td>
                          <td className="py-3 px-4">{post.date}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button className="text-purple-600 hover:text-purple-800">Edit</button>
                              <button className="text-gray-600 hover:text-gray-800">View</button>
                              <button className="text-red-600 hover:text-red-800">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'categories' && (
              <div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Categories</h3>
                      <button className="text-purple-600 hover:text-purple-800">+ Add Category</button>
                    </div>
                    <div className="space-y-2">
                      {mockCategories.map(category => (
                        <div key={category.slug} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-gray-600">{category.slug}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">{category.count} posts</span>
                            <button className="text-purple-600 hover:text-purple-800">Edit</button>
                            <button className="text-red-600 hover:text-red-800">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Tags</h3>
                      <button className="text-purple-600 hover:text-purple-800">+ Add Tag</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['AI Tools', 'Email Marketing', 'Analytics', 'CRM', 'Workflow Automation'].map(tag => (
                        <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {tag}
                          <button className="ml-2 text-purple-600 hover:text-purple-900">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <div>
                <h3 className="text-lg font-semibold mb-6">Blog Analytics Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium mb-4">Top Performing Posts</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">10 Ways AI is Revolutionizing...</span>
                        <span className="text-sm font-medium">2,340 views</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Complete Guide to Marketing...</span>
                        <span className="text-sm font-medium">1,890 views</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Scaling Your Business with Data...</span>
                        <span className="text-sm font-medium">1,567 views</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium mb-4">Traffic Sources</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Organic Search</span>
                        <span className="text-sm font-medium">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Social Media</span>
                        <span className="text-sm font-medium">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Direct</span>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Email</span>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="max-w-2xl">
                <h3 className="text-lg font-semibold mb-6">Blog Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Blog Name</label>
                    <input
                      type="text"
                      defaultValue="TrueFlow Blog"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Blog Description</label>
                    <textarea
                      defaultValue="Insights and resources for business growth"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Posts Per Page</label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Features</h4>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span>Enable Comments</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span>Enable Social Sharing</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span>Show Related Posts</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span>Enable RSS Feed</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="mr-2" />
                        <span>Enable Search</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">SEO Settings</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Default Meta Title</label>
                        <input
                          type="text"
                          defaultValue="TrueFlow Blog"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Title Template</label>
                        <input
                          type="text"
                          defaultValue="%s | TrueFlow Blog"
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm mb-1">Default Meta Description</label>
                        <textarea
                          defaultValue="Discover insights, tips, and strategies for business growth with AI and automation."
                          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}