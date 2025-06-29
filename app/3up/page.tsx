'use client';

import { useState, useEffect } from 'react';
import { CollectionManager } from '@/components/collection-manager';
import { generateNumbers } from '@/lib/utils';

export default function ThreeUpPage() {
  const [numbers, setNumbers] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedData = localStorage.getItem('jantrik-3up');
    if (savedData) {
      setNumbers(JSON.parse(savedData));
    } else {
      const initialNumbers = generateNumbers(0, 999, 3);
      setNumbers(initialNumbers);
    }
  }, []);

  const handleUpdate = (updatedNumbers: Record<string, number>) => {
    setNumbers(updatedNumbers);
    localStorage.setItem('jantrik-3up', JSON.stringify(updatedNumbers));
  };

  return (
    <CollectionManager
      title="3up Collection"
      subtitle="000 - 999"
      numbers={numbers}
      onUpdate={handleUpdate}
      type="3up"
      minNumber={0}
      maxNumber={999}
      numberLength={3}
    />
  );
}