// app/dashboard/page.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from './user-provider';
import { useRouter } from 'next/navigation';
import DOMPurify from 'dompurify';
import Image from 'next/image';


const Dashboard = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string>(''); // Explicitly type the error state as string
  const [keywords, setKeywords] = useState<string>('');
  const [results, setResults] = useState<{titlesEtsy: string, descriptionsEtsy: string, keywordsEtsy: string} | null>(null);
  const [shopName, setShopName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); 
  const [colors, setColors] = useState<string>('');
  const [sizes, setSizes] = useState<string>('');
  const [materials, setMaterials] = useState<string>('');
  const [holiday, setHoliday] = useState<string>('');
  const [personalization, setPersonalization] = useState<boolean>(false);
  const [personalizationDetails, setPersonalizationDetails] = useState<string>('');
  const [extraItems, setExtraItems] = useState<string>('');
  const [platform, setPlatform] = useState<string>('etsy');
  const [platformDisplay, setPlatformDisplay] = useState<string>('etsy');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!keywords || !shopName) {
      setError('Please enter the shop/store name and keywords to generate content.');
      return;
    }
    try {
      setLoading(true);
      const apiUrl = '/api/generator/' + platform;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shopName,
          keywords,
          colors,
          sizes,
          materials,
          holiday,
          personalization: personalization ? personalizationDetails : '',
          extraItems,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data);
        setPlatformDisplay(platform);
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
      setLoading(false);
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

  const createMarkup = (htmlContent: string) => {
    return { __html: DOMPurify.sanitize(htmlContent) };
  };

  return (
  <div className="bg-brandColor1 text-brandColor5 p-6">
    <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
    <p>Welcome, <span className="text-brandColor4">{user?.name}</span></p>
    
    <div className="flex flex-col md:flex-row md:space-x-4">
      {/* Form Section */}
      <div className="flex-1 text-center">
        <form onSubmit={handleSubmit} className="my-4 space-y-2">
        {/* Platform Selection */}
        <div className="mb-4 flex">
          <button
            type="button"
            onClick={() => setPlatform('etsy')}
            className={`flex items-center px-4 py-2 mr-6 ${platform === 'etsy' ? 'bg-brandColor4 text-white ring ring-brandColor5' : 'bg-brandColor2 text-brandColor5'}`}
          >
            <Image src="/etsylogo.png" width={36} height={36} alt="Etsy Logo" className='rounded-lg mr-2'/>
            <p>Etsy</p>
          </button>
          <button
            type="button"
            onClick={() => setPlatform('amazon')}
            className={`flex items-center px-4 py-2 ${platform === 'amazon' ? 'bg-brandColor4 text-white ring ring-brandColor5' : 'bg-brandColor2 text-brandColor5'}`}
          >
            <Image src="/amazonlogo.jpg" width={36} height={36} alt="Amazon Logo" className='rounded-lg mr-2'/>
            <p>Amazon</p>
          </button>
        </div>

          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            placeholder="Enter Shop Name"
            className="w-full bg-brandColor2 border border-brandColor3 text-brandColor5 placeholder-brandColor3 p-2 rounded-lg focus:ring-brandColor4 focus:border-brandColor4"
          />
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Enter keywords"
            className="w-full bg-brandColor2 border border-brandColor3 text-brandColor5 placeholder-brandColor3 p-2 rounded-lg focus:ring-brandColor4 focus:border-brandColor4"
          />
          <input
            type="text"
            value={colors}
            onChange={(e) => setColors(e.target.value)}
            placeholder="Enter colors"
            className="w-full bg-brandColor2 border border-brandColor3 text-brandColor5 placeholder-brandColor3 p-2 rounded-lg focus:ring-brandColor4 focus:border-brandColor4"
          />
          <input
            type="text"
            value={sizes}
            onChange={(e) => setSizes(e.target.value)}
            placeholder="Enter sizes"
            className="w-full bg-brandColor2 border border-brandColor3 text-brandColor5 placeholder-brandColor3 p-2 rounded-lg focus:ring-brandColor4 focus:border-brandColor4"
          />
          <input
            type="text"
            value={materials}
            onChange={(e) => setMaterials(e.target.value)}
            placeholder="Enter materials"
            className="w-full bg-brandColor2 border border-brandColor3 text-brandColor5 placeholder-brandColor3 p-2 rounded-lg focus:ring-brandColor4 focus:border-brandColor4"
          />
          <input
            type="text"
            value={holiday}
            onChange={(e) => setHoliday(e.target.value)}
            placeholder="Enter holiday"
            className="w-full bg-brandColor2 border border-brandColor3 text-brandColor5 placeholder-brandColor3 p-2 rounded-lg focus:ring-brandColor4 focus:border-brandColor4"
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={personalization}
              onChange={(e) => setPersonalization(e.target.checked)}
              className="form-checkbox h-5 w-5 text-brandColor4 rounded border-gray-300 focus:ring-brandColor4 focus:ring-offset-0 transition duration-150 ease-in-out"
            />
            <span>Personalization</span>
          </label>
          {personalization && (
            <input
              type="text"
              value={personalizationDetails}
              onChange={(e) => setPersonalizationDetails(e.target.value)}
              placeholder="Describe personalization (include character or other limitations if applicable)"
              className="w-full bg-brandColor2 border border-brandColor3 text-brandColor5 placeholder-brandColor3 p-2 rounded-lg focus:ring-brandColor4 focus:border-brandColor4"
            />
          )}
          <input
            type="text"
            value={extraItems}
            onChange={(e) => setExtraItems(e.target.value)}
            placeholder="Enter extra items that come with product"
            className="w-full bg-brandColor2 border border-brandColor3 text-brandColor5 placeholder-brandColor3 p-2 rounded-lg focus:ring-brandColor4 focus:border-brandColor4"
          />
          <button type="submit" className="px-4 py-2 bg-brandColor5 text-brandColor1 font-semibold rounded-lg hover:bg-brandColor4">
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>
        {error && <p className="error text-red-500">{error}</p>}
      </div>

      {/* Results Section */}
      <div className="flex-1 mt-4">
        {loading ? (
        <div className="flex justify-center items-center">
          <div className="loader"></div>
        </div>
        ) : (
          <div>
            {results && (
              <div className="p-4 bg-brandColor2 rounded-lg text-brandColor5">
                <h2 className="text-lg font-semibold">Generated Results for {platformDisplay.charAt(0).toUpperCase() + platformDisplay.slice(1)}</h2>
                <div><strong>Title:</strong> {results.titlesEtsy}</div>
                <div>{platformDisplay === 'etsy' && <strong>Description:</strong>} <div dangerouslySetInnerHTML={createMarkup(results.descriptionsEtsy)} /></div>
                <div><strong>Keywords:</strong> {results.keywordsEtsy}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>

  );
};

export default Dashboard;
