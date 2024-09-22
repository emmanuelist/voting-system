import React, { useState, useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { StacksTestnet } from '@stacks/network';
import { callReadOnlyFunction, contractPrincipalCV, stringAsciiCV, makeContractCall, broadcastTransaction } from '@stacks/transactions';
import { UserSession } from '@stacks/auth';
import VotingForm from './components/VotingForm';
import Results from './components/Results';

const App = () => {
  const [votingOptions, setVotingOptions] = useState([]);
  const [results, setResults] = useState({});
  const [userSession, setUserSession] = useState(new UserSession());

  useEffect(() => {
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

    fetchVotingOptions();
    fetchResults();
  }, [votingOptions]);

  const fetchVotingOptions = async () => {
    const options = await callReadOnlyFunction({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'voting',
      functionName: 'get-voting-options',
      network: new StacksTestnet(),
    });
    setVotingOptions(options.value.list);
  };

  const handleVote = async (option) => {
    const transaction = await makeContractCall({
      contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      contractName: 'voting',
      functionName: 'vote',
      functionArgs: [stringAsciiCV(option)],
      senderKey: userSession.loadUserData().appPrivateKey,
      network: new StacksTestnet(),
    });

    const result = await broadcastTransaction(transaction, new StacksTestnet());
    console.log(result);

    setResults((prevResults) => ({
      ...prevResults,
      [option]: (prevResults[option] || 0) + 1,
    }));
  };

  return (
    <div>
      <h1>Voting System</h1>
      <Connect
        authOptions={{
          appDetails: {
            name: 'Voting App',
            icon: window.location.origin + '/logo.svg',
          },
          redirectTo: '/',
          onFinish: () => {
            const userSession = new UserSession();
            setUserSession(userSession);
          },
          userSession,
        }}
      />
      <VotingForm onVote={handleVote} />
      <Results results={results} />
    </div>
  );
};

export default App;