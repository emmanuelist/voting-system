import React, { useState, useEffect } from 'react';
import { Connect } from '@stacks/connect-react';
import { UserSession } from '@stacks/auth';
import VotingForm from './components/VotingForm';
import Results from './components/Results';
import { fetchVotingOptions, fetchVoteCount } from './services/votingService';

const initialState = {
  votingOptions: [],
  results: {},
  userSession: new UserSession(),
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_VOTING_OPTIONS':
      return { ...state, votingOptions: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload };
    case 'SET_USER_SESSION':
      return { ...state, userSession: action.payload };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const fetchResults = async () => {
      const newResults = {};
      for (const option of state.votingOptions) {
        const count = await fetchVoteCount(option);
        newResults[option] = count;
      }
      dispatch({ type: 'SET_RESULTS', payload: newResults });
    };

    fetchVotingOptions().then((options) => {
      dispatch({ type: 'SET_VOTING_OPTIONS', payload: options });
      fetchResults();
    });
  }, [state.votingOptions]);

  const handleVote = (option) => {
    dispatch({
      type: 'SET_RESULTS',
      payload: {
        ...state.results,
        [option]: (state.results[option] || 0) + 1,
      },
    });
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
            dispatch({ type: 'SET_USER_SESSION', payload: userSession });
          },
          userSession: state.userSession,
        }}
      />
      <VotingForm onVote={handleVote} />
      <Results results={state.results} />
    </div>
  );
};

export default App;