
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';

const OutfitDetailsPage = () => {
  const { id } = useParams();

  return (
    <Container className="py-20 min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Outfit Details</h1>
        <p className="text-white/70">Outfit ID: {id}</p>
        <p className="text-white/70 mt-4">This page is under development.</p>
      </div>
    </Container>
  );
};

export default OutfitDetailsPage;
