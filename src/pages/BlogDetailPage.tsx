import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { ArrowLeftOutlined, FileTextOutlined, ClockCircleOutlined } from '@ant-design/icons';
import 'highlight.js/styles/github-dark.css';

/**
 * Blog 详情页面
 * 渲染单个 Markdown 文件的内容
 */
const BlogDetailPage: React.FC = () => {
  const { filename } = useParams<{ filename: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    const loadMarkdown = async () => {
      if (!filename) {
        setError('文件名不存在');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 动态导入 Markdown 文件
        const markdownModule = await import(`../../docs/${filename}`);
        const response = await fetch(markdownModule.default);
        const text = await response.text();

        setContent(text);

        // 从内容中提取标题
        const match = text.match(/^#\s+(.+)$/m);
        if (match && match[1]) {
          setTitle(match[1].trim());
        } else {
          // 从文件名提取标题
          const titleFromFilename = filename
            .replace('.md', '')
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
          setTitle(titleFromFilename);
        }
      } catch (err) {
        console.error('加载 Markdown 文件失败:', err);
        setError('无法加载文章内容，请检查文件是否存在');
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [filename]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">加载失败</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => navigate('/blog')}
              className="btn btn-primary"
            >
              返回列表
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 返回按钮 */}
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ArrowLeftOutlined className="mr-2" />
          返回文章列表
        </Link>

        {/* 文章头部 */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center">
              <FileTextOutlined className="mr-2" />
              {filename}
            </span>
            <span className="flex items-center">
              <ClockCircleOutlined className="mr-2" />
              Markdown 文档
            </span>
          </div>
        </div>

        {/* Markdown 内容 */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <article className="prose prose-lg max-w-none
            prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
            prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:border-b prose-h2:pb-2
            prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-code:text-pink-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:italic
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4
            prose-li:text-gray-700 prose-li:my-1
            prose-table:border-collapse prose-table:w-full prose-table:my-6
            prose-th:bg-gray-100 prose-th:border prose-th:border-gray-300 prose-th:p-3 prose-th:text-left prose-th:font-semibold
            prose-td:border prose-td:border-gray-300 prose-td:p-3
            prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
            prose-hr:border-gray-300 prose-hr:my-8
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-em:text-gray-700 prose-em:italic
          ">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                // 自定义代码块渲染
                code({ inline, className, children, ...props }: any) {
                  return inline ? (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
                // 自定义链接渲染（外部链接在新标签页打开）
                a({ children, href, ...props }: any) {
                  const isExternal = href?.startsWith('http');
                  return (
                    <a
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>

        {/* 底部导航 */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/blog"
            className="btn btn-primary"
          >
            <ArrowLeftOutlined className="mr-2" />
            返回文章列表
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
