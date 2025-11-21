
import React from 'react';
import EditorView from '@/components/EditorView';

export default function EditorPage() {
  return (
    <main className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">👔 Apparel BOM Editor (MVP)</h1>
      <EditorView />
    </main>
  );
}