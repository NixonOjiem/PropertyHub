'use client';
import React from 'react';
import { useState, useEffect } from 'react';

export default function Home() {
 const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ROUTE}/trial-route`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };
  
    fetchMessage();}, []);


  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div> Hello the message is: {message} <br /> <a>Go to sign up</a></div>
       

    </div>
  );
}
