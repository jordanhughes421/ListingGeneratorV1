// app/dashboard/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from './user-provider';
import { useRouter } from 'next/navigation';



const Dashboard = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string>(''); // Explicitly type the error state as string
  const [keywords, setKeywords] = useState<string>('');
  const [results, setResults] = useState<{titles: string, descriptions: string, keywords: string} | null>(null);


  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
      } else {
        router.push('/dashboard/login');
        throw new Error(data.message || 'Failed to check session');
      }
    } catch (error: unknown) {
      // Check if the error is an instance of Error and set the message, else set a default error message
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!keywords) {
      setError('Please enter some keywords to generate content.');
      return;
    }
    try {
      const response = await fetch('/api/generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywords }),
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data);
        setError('');
      } else {
        throw new Error(data.message || 'Failed to generate content');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    if (!user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter keywords"
        />
        <button type="submit">Generate</button>
      </form>
      {error && <p className="error">{error}</p>}
      {results && (
        <div>
          <h2>Generated Results</h2>
          <p><strong>Title:</strong> {results.titles}</p>
          <p><strong>Description:</strong> {results.descriptions}</p>
          <p><strong>Keywords:</strong> {results.keywords}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
