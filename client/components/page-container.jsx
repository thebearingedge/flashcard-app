import React from 'react';

export default function PageContainer({ children }) {
  return (
    <div className="container page-container">
      { children }
    </div>
  );
}
