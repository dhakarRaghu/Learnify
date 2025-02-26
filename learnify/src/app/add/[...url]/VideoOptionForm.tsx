'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Module {
  id: string;
  name: string;
}

interface Props {
  videoId: string;
  playlistId: string | null;
  userId: string;
  modules: Module[];
}

export default function VideoOptionsForm({ videoId, playlistId, userId, modules }: Props) {
  const [action, setAction] = useState<'single' | 'playlist' | 'new'>('single');
  const [moduleId, setModuleId] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveAction = moduleId ? 'existing' : action;
    const res = await fetch('/api/add-to-module', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        videoId,
        playlistId: action === 'playlist' ? playlistId : null,
        moduleId,
        action: effectiveAction,
      }),
    });
    const data = await res.json();
    console.log(data);
    if (res.ok) {
      router.push(`/video-modules/${data.module.id}`);
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add to Video Module</h3>
      <div>
        <label>
          <input
            type="radio"
            value="single"
            checked={action === 'single'}
            onChange={() => setAction('single')}
          />
          Add only this video
        </label>
        {playlistId && (
          <label>
            <input
              type="radio"
              value="playlist"
              checked={action === 'playlist'}
              onChange={() => setAction('playlist')}
            />
            Add entire playlist
          </label>
        )}
        <label>
          <input
            type="radio"
            value="new"
            checked={action === 'new'}
            onChange={() => setAction('new')}
          />
          Create new module
        </label>
      </div>
      {(action === 'single' || action === 'playlist') && (
        <div>
          <label>
            Select Existing Module:
            <select
              value={moduleId || ''}
              onChange={(e) => setModuleId(e.target.value || null)}
            >
              <option value="">-- Select a module --</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <button type="submit" disabled={!moduleId && action !== 'new'}>
        Add to Module
      </button>
    </form>
  );
}