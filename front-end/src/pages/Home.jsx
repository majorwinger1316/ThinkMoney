import React, { useState, useEffect } from 'react';
import '../Styles/Home.css';
import twitterIcon from '../assets/twitter.png';
import XIcon from '../assets/new.avif';
import landing from '../assets/landing.png';

function Home() {
  const [quote, setQuote] = useState({
    text: 'Difficulties increase the nearer we get to the goal.',
    author: 'Johann Wolfgang von Goethe',
  });

  const loadQuotes = async () => {
    try {
      const response = await fetch('https://type.fit/api/quotes');
      if (!response.ok) {
        throw new Error('Failed to fetch quotes');
      }
      const quotes = await response.json();
      if (quotes && quotes.length > 0) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(randomQuote);
      }
    } catch (error) {
      console.error('Error loading quotes:', error.message);
      // Set default quote if fetching fails
      setQuote({
        text: 'Difficulties increase the nearer we get to the goal.',
        author: 'Johann Wolfgang von Goethe',
      });
    }
  };

  useEffect(() => {
    loadQuotes();

    // Change quote every 10 seconds
    const interval = setInterval(() => {
      loadQuotes();
    }, 10000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []); // Run once when component mounts

  const shareOnTwitter = () => {
    const twitterText = `${quote.text} - ${quote.author.split(',')[0]}`;
    const encodedText = encodeURIComponent(twitterText);
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(tweetUrl);
  };

  return (
    <div className="home">
      <div className="heading">
        <img src={landing} alt="icon" />
      </div>
      <div className="container">
        <div className="quote">
          {quote.text}
          <div className="author">- {quote.author.split(',')[0]}</div>
        </div>
        <div className="bottom">
          <div className="icons">
            <img src={XIcon} onClick={shareOnTwitter} alt="Twitter" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
