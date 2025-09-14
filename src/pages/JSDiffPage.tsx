import React from 'react';
import JSDiffViewer from '../components/JSDiffViewerFixed';

const JSDiffPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <JSDiffViewer />
    </div>
  );
};

export default JSDiffPage;
