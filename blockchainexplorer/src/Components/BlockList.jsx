import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BlockList({ onSelectBlock }) {
  const [currentBlock, setCurrentBlock] = useState(null);
  const [searchedBlock, setSearchedBlock] = useState(null);
  const [searchBlock, setSearchBlock] = useState('');
  const [showCurrentBlock, setShowCurrentBlock] = useState(true); // Indicates whether to show current or searched block
  const apiUrl = 'https://api-testnet.polygonscan.com/api';
  const apiKey = 'UM3TQHFPZHVJ488EGRZZRW521AJNJX348Z';
  const module = 'proxy';

  useEffect(() => {
    if (showCurrentBlock) {
      // Fetch the details of the current block when the component loads
      const action = 'eth_blockNumber';
      const url = `${apiUrl}?module=${module}&action=${action}&apikey=${apiKey}`;
      axios
        .get(url)
        .then((res) => {
          const blockNumber = res.data.result;
          fetchBlockDetails(blockNumber, setCurrentBlock);
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    }
  }, [showCurrentBlock]);

  const fetchBlockDetails = (blockNumber, setter) => {
    const hexBlockNumber = `${blockNumber}`;
    const action = 'eth_getBlockByNumber';
    const tag = hexBlockNumber;
    const url = `${apiUrl}?module=${module}&action=${action}&tag=${tag}&boolean=false&apikey=${apiKey}`;
    axios
      .get(url)
      .then((res) => {
        const blockInfo = res.data.result;
        setter(blockInfo);
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  };

  const handleSearch = () => {
    const hexBlockNumber = searchBlock.trim();
    if (hexBlockNumber !== '') {
      setShowCurrentBlock(false); // Switch to showing searched block
      fetchBlockDetails(hexBlockNumber, setSearchedBlock);
    }
  };

  const handleShowCurrent = () => {
    setShowCurrentBlock(true); // Switch to showing current block
    setSearchBlock(''); // Clear the search input when showing the current block
    setSearchedBlock(null); // Clear the searched block info
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    handleSearch(); // Call the search function when the form is submitted
  };

  return (
    <div>
      <h2>{showCurrentBlock ? 'Current Block' : 'Searched Block'}</h2>
      {showCurrentBlock && currentBlock && (
        <ul style={{ listStyleType: 'none' }}>
          <li>BlockNumber: {currentBlock.number}</li>
          <li>Timestamp: {currentBlock.timestamp}</li>
          <li>Hash: {currentBlock.hash}</li>
        </ul>
      )}

      {!showCurrentBlock && searchedBlock && (
        <ul style={{ listStyleType: 'none' }}>
          <li>BlockNumber: {searchedBlock.number}</li>
          <li>Timestamp: {searchedBlock.timestamp}</li>
          <li>Hash: {searchedBlock.hash}</li>
        </ul>
      )}

      <div>
        {!showCurrentBlock && (
          <button onClick={handleShowCurrent}>Show Current Block</button>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter block number (in hex)"
            value={searchBlock}
            onChange={(e) => setSearchBlock(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  );
}

export default BlockList;