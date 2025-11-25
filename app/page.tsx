"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import config from './config';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem(config.token);
    
    if (token) {
      // If token exists, redirect to backoffice
      router.push('/backoffice');
    } else {
      // If no token, redirect to signin
      router.push('/signin');
    }
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default HomePage