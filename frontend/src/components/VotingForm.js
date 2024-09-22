import React, { useState } from 'react';

const VotingForm = ({ onVote }) => {
	const [selectedOption, setSelectedOption] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		onVote(selectedOption);
	};

	return (
		<form onSubmit={handleSubmit}>
			<select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
				<option value="" disabled>Select an option</option>
				<option value="option1">Option 1</option>
				<option value="option2">Option 2</option>
			</select>
			<button type="submit">Vote</button>
		</form>
	);
};

export default VotingForm;

