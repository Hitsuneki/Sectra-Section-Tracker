import React from 'react';

interface SectionDetailPageProps {
  params: {
    sectionId: string;
  };
}

const SectionDetailPage: React.FC<SectionDetailPageProps> = ({ params }) => {
  return (
    <div>
      <h1>Section Detail: {params.sectionId}</h1>
      <p>Students and tasks for this section.</p>
    </div>
  );
};

export default SectionDetailPage;
