import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [url, setUrl] = useState('');
  const [directory, setDirectory] = useState('');
  const [scraping, setScraping] = useState(false);
  const [file,setFile] = useState('')
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setScraping(true);
    try {
      const response = await fetch('/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url,file,directory }), //fields
      });
      if (response.ok) {
        const data = await response.json();
        setMessage(`CSV file saved to: ${data.message}`);
      } else {
        setMessage(`Error: ${response.statusText}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className='containerStyle'>
      <h1 className='h1Style'>
        WEB SCRAPER
      </h1>
      <form onSubmit={handleSubmit} className='formStyle'>
        <label htmlFor="url" className='labelStyle'>Enter the URL to scrape:</label>
        <input
          type="text"
          id="url"
          name="url"
          required
          className='inputStyle'
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />

        <label htmlFor="file" className='labelStyle'>Enter File Name</label>
        <textarea
          type= 'text'
          id="file"
          name="file"
          placeholder="File Name To be saved as"
          className='inputStyle'
          value={file}
          onChange={(event) => setFile(event.target.value)}
          />

        <label htmlFor="directory" className='labelStyle'>Enter the directory to save the CSV file:</label>
        <input
          type="text"
          id="directory"
          name="directory"
          required
          className='inputStyle'
          value={directory}
          onChange={(event) => setDirectory(event.target.value)}
        />

        <button type="submit" className='buttonStyle' disabled={scraping}>
          {scraping? 'Scraping...' : 'Scrape'}
        </button>

        {message && <p className='messageStyle'>{message}</p>}
      </form>
    </div>
  );
};

export default App;