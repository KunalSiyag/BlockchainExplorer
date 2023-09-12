import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

function BlockList({ onSelectBlock }) {
  const [currentBlock, setCurrentBlock] = useState(null);
  const [searchedBlock, setSearchedBlock] = useState(null);
  const [searchBlock, setSearchBlock] = useState('');
  const [showCurrentBlock, setShowCurrentBlock] = useState(true);
  const [blockHistory, setBlockHistory] = useState([]);
  const apiUrl = 'https://api-testnet.polygonscan.com/api';
  const apiKey = 'UM3TQHFPZHVJ488EGRZZRW521AJNJX348Z';
  const module = 'proxy';

  useEffect(() => {
    const fetchRecentBlocks = async () => {
      const action = 'eth_blockNumber';
      const url = `${apiUrl}?module=${module}&action=${action}&apikey=${apiKey}`;
      try {
        const res = await axios.get(url);
        const currentBlockNumberHex = res.data.result;
        const currentBlockNumber = parseInt(currentBlockNumberHex, 16);
        const recentBlockNumbers = Array.from(
          { length: 10 },
          (_, i) => (currentBlockNumber - i).toString(16)
        );

        const recentBlocks = await Promise.all(
          recentBlockNumbers.map(async (blockNumberHex) => {
            const blockInfo = await fetchBlockDetails(blockNumberHex);
            return blockInfo;
          })
        );

        setBlockHistory(recentBlocks);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchRecentBlocks();

    const intervalId = setInterval(async () => {
      const action = 'eth_blockNumber';
      const url = `${apiUrl}?module=${module}&action=${action}&apikey=${apiKey}`;
      try {
        const res = await axios.get(url);
        const currentBlockNumberHex = res.data.result;
        const currentBlockNumber = parseInt(currentBlockNumberHex, 16);
        const newBlockNumberHex = (currentBlockNumber + 1).toString(16);

        const newBlock = await fetchBlockDetails(newBlockNumberHex);

        setBlockHistory((prevHistory) => {
          const newHistory = [...prevHistory, newBlock];
          if (newHistory.length > 15) {
            newHistory.shift();
          }
          return newHistory;
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const fetchBlockDetails = async (blockNumberHex) => {
    const action = 'eth_getBlockByNumber';
    const tag = blockNumberHex;
    const url = `${apiUrl}?module=${module}&action=${action}&tag=${tag}&boolean=false&apikey=${apiKey}`;

    try {
      const res = await axios.get(url);
      return res.data.result;
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = async () => {
    const hexBlockNumber = searchBlock.trim();
    if (hexBlockNumber !== '') {
      setShowCurrentBlock(false);
      try {
        const blockInfo = await fetchBlockDetails(hexBlockNumber);
        setSearchedBlock(blockInfo);
        setBlockHistory((prevHistory) => {
          const newHistory = [...prevHistory, blockInfo];
          if (newHistory.length > 15) {
            newHistory.shift();
          }
          return newHistory;
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleShowCurrent = () => {
    setShowCurrentBlock(true);
    setSearchBlock('');
    setSearchedBlock(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <div>
      <h2>{showCurrentBlock ? 'Recent Blocks' : 'Searched Block'}</h2>
      <table>
        <tbody>
          <tr>
            <th>Block Number</th>
            <th>Timestamp</th>
            <th>Hash</th>
          </tr>
          {showCurrentBlock && currentBlock && (
            <tr>
              <td>{currentBlock.number}</td>
              <td>{currentBlock.timestamp}</td>
              <td>{currentBlock.hash}</td>
            </tr>
          )}
          {!showCurrentBlock && searchedBlock && (
            <tr>
              <td>{searchedBlock.number}</td>
              <td>{searchedBlock.timestamp}</td>
              <td>{searchedBlock.hash}</td>
            </tr>
          )}
          {blockHistory.map((blockInfo) => (
            <tr key={blockInfo.number}>
              <td>{blockInfo.number}</td>
              <td>{blockInfo.timestamp}</td>
              <td>{blockInfo.hash}</td>
            </tr>
          ))}
        </tbody>
      </table>

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