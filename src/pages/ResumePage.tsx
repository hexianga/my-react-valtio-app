import React, { useEffect, useState } from 'react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import PageLoading from '../components/PageLoading';
import ErrorState from '../components/ErrorState';
import 'highlight.js/styles/atom-one-dark.css';

const ResumePage: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);

        const markdownModule = await import('../../docs/RESUME1.md');
        const response = await fetch(markdownModule.default);
        const text = await response.text();

        setContent(text);

        const match = text.match(/^#\s+(.+)$/m);
        if (match && match[1]) {
          setTitle(match[1].trim());
        } else {
          setTitle('个人简历');
        }
      } catch {
        setError('无法加载简历内容，请检查文件是否存在');
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, []);

  if (loading) {
    return <PageLoading />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        actions={
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            重试
          </button>
        }
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <article
            className="prose prose-lg max-w-none
            prose-headings:font-bold
            prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8
            prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:border-b prose-h2:pb-2
            prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4
            prose-p:text-gray-700 prose-p:leading-relaxed
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-pre:bg-transparent prose-pre:p-0 prose-pre:rounded-none prose-pre:overflow-x-auto
            prose-code:bg-transparent prose-code:p-0 prose-code:rounded-none
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
          "
          >
            <MarkdownRenderer content={content} />
          </article>
        </div>
      </div>
    </div>
  );
};

export default ResumePage;
