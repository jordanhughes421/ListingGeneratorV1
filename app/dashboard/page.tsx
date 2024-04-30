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
  const [results, setResults] = useState<{titlesEtsy: string, descriptionsEtsy: string, keywordsEtsy: string} | null>(null);
  const [shopName, setshopName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!keywords) {
      setError('Please enter some keywords to generate content.');
      return;
    }
    else if (!shopName) {
      setError('Please enter some keywords to generate content.');
      return;
    }
    try {
      setLoading(true);
      const response = await fetch('/api/generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shopName, keywords }),
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
    } finally {
      setLoading(false); // Set loading state back to false when request completes
    }
  };

  useEffect(() => {
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
    if (!user) {
      fetchUserData();
    }
  }, [router, setUser, user]);

  return (
    <div className="bg-brandColor1 text-brandColor5 p-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p>Welcome, <span className="text-brandColor4">{user?.name}</span></p>
      <form onSubmit={handleSubmit} className="my-4">
      <input
          type="text"
          value={shopName}
          onChange={(e) => setshopName(e.target.value)}
          placeholder="Enter Shop Name"
          className="input bg-brandColor2 border border-brandColor3 text-brandColor5 placeholder-brandColor3 p-2 rounded-lg focus:ring-brandColor4 focus:border-brandColor4 m-2"
        />
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter keywords"
          className="input bg-brandColor2 border border-brandColor3 text-brandColor5 placeholder-brandColor3 p-2 rounded-lg focus:ring-brandColor4 focus:border-brandColor4 m-2"
        />
        <button type="submit" className="ml-2 px-4 py-2 bg-brandColor5 text-brandColor1 font-semibold rounded-lg hover:bg-brandColor4">
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </form>
      {error && <p className="error text-red-500">{error}</p>}
      {results && (
        <div className="mt-4 p-4 bg-brandColor2 rounded-lg text-brandColor5">
          <h2 className="text-lg font-semibold">Generated Results for Etsy</h2>
          <p><strong>Title:</strong> {results.titlesEtsy}</p>
          <p><strong>Description:</strong> {results.descriptionsEtsy}</p>
          <p><strong>Keywords:</strong> {results.keywordsEtsy}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
