'use client';

import { useState, useEffect } from 'react';
import { CollectionManager } from '@/components/collection-manager';
import { generateNumbers } from '@/lib/utils';

export default function DownPage() {
  const [numbers, setNumbers] = useState<Record<string, number>>({});

  useEffect(() => {
    const savedData = localStorage.getItem('jantrik-down');
    if (savedData) {
      setNumbers(JSON.parse(savedData));
    } else {
      const initialNumbers = generateNumbers(0, 99, 2);
      setNumbers(initialNumbers);
    }
  }, []);

  const handleUpdate = (updatedNumbers: Record<string, number>) => {
    setNumbers(updatedNumbers);
    localStorage.setItem('jantrik-down', JSON.stringify(updatedNumbers));
  };

  return (
    <CollectionManager
      title="Down Collection"
      subtitle="00 - 99"
      numbers={numbers}
      onUpdate={handleUpdate}
      type="down"
      minNumber={0}
      maxNumber={99}
      numberLength={2}
    />
  );
}