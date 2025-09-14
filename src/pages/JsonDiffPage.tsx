import React from 'react';
import JsonDiffViewer from '../components/JsonDiffViewer';

const JsonDiffPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <JsonDiffViewer />
    </div>
  );
};

export default JsonDiffPage;
