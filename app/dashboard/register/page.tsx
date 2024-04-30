'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../user-provider';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>(''); // Explicitly type the error state as string
  const router = useRouter();
  const { user, setUser } = useUser();

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
        router.push('/dashboard');
      } else {
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
          router.push('/dashboard');
        } else {
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
    
    fetchUserData();
  }, [router, setUser]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      console.log(JSON.stringify({ name, email, password }));
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        router.push('/auth/login'); // Redirect to login page on successful registration
      } else {
        throw new Error(data.message || 'Failed to register');
      }
    } catch (error: unknown) {
      // Check if the error is an instance of Error
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
<div className="bg-brandColor1 p-8">
  <h1 className="text-3xl font-bold mb-4">Register</h1>
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label htmlFor="name" className="block text-lg text-brandColor5 mb-1">Name:</label>
      <input
        type="text"
        id="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full lg:w-2/3 px-4 py-2 rounded border border-brandColor3 focus:outline-none focus:border-brandColor4"
      />
    </div>
    <div>
      <label htmlFor="email" className="block text-lg text-brandColor5 mb-1">Email:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="w-full lg:w-2/3 px-4 py-2 rounded border border-brandColor3 focus:outline-none focus:border-brandColor4"
      />
    </div>
    <div>
      <label htmlFor="password" className="block text-lg text-brandColor5 mb-1">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full lg:w-2/3 px-4 py-2 rounded border border-brandColor3 focus:outline-none focus:border-brandColor4"
      />
    </div>
    <button type="submit" className="w-full lg:w-2/3 bg-brandColor4 text-white py-2 rounded hover:bg-brandColor3 transition duration-300">Register</button>
  </form>
</div>
  );
};

export default RegisterPage;
