import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileTextOutlined, FolderOutlined, SearchOutlined } from '@ant-design/icons';

interface BlogPost {
  id: string;
  title: string;
  filename: string;
  size: string;
  category: string;
}

/**
 * Blog 列表页面
 * 显示 docs 目录下的所有 Markdown 文件
 */
const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // 从文件名提取标题和分类
  const parseFilename = (filename: string): { title: string; category: string } => {
    const nameWithoutExt = filename.replace('.md', '');

    // 根据文件名前缀判断分类
    let category = '其他';
    if (nameWithoutExt.includes('API') || nameWithoutExt.includes('AXIOS')) {
      category = 'API 开发';
    } else if (nameWithoutExt.includes('GIT') || nameWithoutExt.includes('HOOK') || nameWithoutExt.includes('BRANCH')) {
      category = 'Git 工具';
    } else if (nameWithoutExt.includes('REQUEST')) {
      category = '请求处理';
    } else if (nameWithoutExt.includes('ENV') || nameWithoutExt.includes('CONFIG')) {
      category = '配置';
    } else if (nameWithoutExt.includes('JSDIFF') || nameWithoutExt.includes('style')) {
      category = '工具库';
    }

    // 格式化标题
    const title = nameWithoutExt
      .replace(/_/g, ' ')
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    return { title, category };
  };

  // 从 Markdown 内容中提取标题
  const extractTitleFromMarkdown = async (filename: string): Promise<string> => {
    try {
      // 动态导入 Markdown 文件
      const markdownModule = await import(`../../docs/${filename}`);
      const response = await fetch(markdownModule.default);
      const text = await response.text();

      // 查找第一个 # 标题
      const match = text.match(/^#\s+(.+)$/m);
      if (match && match[1]) {
        return match[1].trim();
      }

      // 如果没找到标题，使用文件名
      return filename.replace('.md', '').replace(/_/g, ' ').replace(/-/g, ' ');
    } catch (error) {
      console.error(`提取标题失败: ${filename}`, error);
      // 失败时使用文件名
      return filename.replace('.md', '').replace(/_/g, ' ').replace(/-/g, ' ');
    }
  };

  // 加载 Markdown 文件列表
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);

        // 这里我们需要手动列出所有的 Markdown 文件
        // 因为 Webpack 不支持动态 require 目录
        const markdownFiles = [
          'API_REFACTORING_ANALYSIS.md',
          'AXIOS_OPTIMIZATION_GUIDE.md',
          'BRANCH_PROTECTION.md',
          'ENV_CONFIG.md',
          'JSDIFF_README.md',
          'NATIVE_GIT_HOOKS_GUIDE.md',
          'REQUESTID_SUMMARY.md',
          'REQUEST_ID_GUIDE.md',
          'REQUEST_ID_QUICK_REFERENCE.md',
          'SETUP_NATIVE_HOOKS.md',
          'style-test.md',
        ];

        // 并行加载所有文件的标题
        const blogPosts: BlogPost[] = await Promise.all(
          markdownFiles.map(async (filename, index) => {
            const title = await extractTitleFromMarkdown(filename);
            const { category } = parseFilename(filename);
            return {
              id: `post-${index}`,
              title,
              filename,
              size: '未知',
              category,
            };
          })
        );

        setPosts(blogPosts);
        setFilteredPosts(blogPosts);
      } catch (error) {
        console.error('加载文章列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // 搜索和筛选
  useEffect(() => {
    let filtered = posts;

    // 按分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // 按搜索词筛选
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory, posts]);

  // 获取所有分类
  const categories = ['all', ...Array.from(new Set(posts.map(post => post.category)))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 技术文档博客
          </h1>
          <p className="text-lg text-gray-600">
            浏览和学习项目中的技术文档
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索文章标题或文件名..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 分类筛选 */}
            <div className="flex items-center space-x-2">
              <FolderOutlined className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? '全部分类' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 统计信息 */}
          <div className="mt-4 text-sm text-gray-600">
            找到 <span className="font-semibold text-blue-600">{filteredPosts.length}</span> 篇文章
            {searchTerm && ` (搜索: "${searchTerm}")`}
            {selectedCategory !== 'all' && ` (分类: ${selectedCategory})`}
          </div>
        </div>

        {/* 文章列表 */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              没有找到文章
            </h3>
            <p className="text-gray-600">
              尝试调整搜索条件或选择其他分类
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${encodeURIComponent(post.filename.replace('.md', ''))}`}
                className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  {/* 分类标签 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <FolderOutlined className="mr-1" />
                      {post.category}
                    </span>
                  </div>

                  {/* 标题 */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* 文件信息 */}
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center">
                      <FileTextOutlined className="mr-1" />
                      Markdown
                    </span>
                  </div>

                  {/* 文件名 */}
                  <div className="mt-3 text-xs text-gray-400 font-mono truncate">
                    {post.filename}
                  </div>
                </div>

                {/* 底部装饰条 */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;
