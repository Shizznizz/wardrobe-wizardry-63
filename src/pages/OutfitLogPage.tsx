
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';

const OutfitLogPage = () => {
  const { id } = useParams();

  return (
    <Container className="py-20 min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Outfit Log</h1>
        {id && <p className="text-white/70">Log ID: {id}</p>}
        <p className="text-white/70 mt-4">This page is under development.</p>
      </div>
    </Container>
  );
};

export default OutfitLogPage;
