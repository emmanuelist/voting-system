import React, { useState, useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import { callReadOnlyFunction, contractPrincipalCV, stringAsciiCV } from '@stacks/transactions';
import VotingForm from './components/VotingForm';
import Results from './components/Results';

const App = () => {
  const [votingOptions, setVotingOptions] = useState([]);
  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchVotingOptions = async () => {
      const options = await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'voting',
        functionName: 'get-voting-options',
        network: new StacksTestnet(),
      });
      setVotingOptions(options.value.list);
    };

    const fetchResults = async () => {
      const newResults = {};
      for (const option of votingOptions) {
        const count = await callReadOnlyFunction({
          contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
          contractName: 'voting',
          functionName: 'get-vote-count',
          functionArgs: [stringAsciiCV(option)],
          network: new StacksTestnet(),
        });
        newResults[option] = count.value;
      }
      setResults(newResults);
    };

    fetchVotingOptions().then(fetchResults);
  }, [votingOptions]);

  const handleVote = (option) => {
    setResults((prevResults) => ({
      ...prevResults,
      [option]: (prevResults[option] || 0) + 1,
    }));
  };

  return (
    <div>
      <h1>Voting System</h1>
      <VotingForm onVote={handleVote} />
      <Results results={results} />
    </div>
  );
};

export default App;