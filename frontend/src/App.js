import React, { useState, useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { UserSession } from '@stacks/auth';
import VotingForm from './components/VotingForm';
import Results from './components/Results';
import { fetchVotingOptions, fetchVoteCount } from './services/votingService';

const App = () => {
  const [votingOptions, setVotingOptions] = useState([]);
  const [results, setResults] = useState({});
  const [userSession, setUserSession] = useState(new UserSession());

  useEffect(() => {
    const fetchResults = async () => {
      const newResults = {};
      for (const option of votingOptions) {
        const count = await fetchVoteCount(option);
        newResults[option] = count;
      }
      setResults(newResults);
    };

    fetchVotingOptions().then((options) => {
      setVotingOptions(options);
      fetchResults();
    });
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