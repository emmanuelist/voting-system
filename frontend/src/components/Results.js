import React from 'react';

const Results = ({ results }) => {
	return (
		<div>
			<h2>Results</h2>
			<ul>
				{Object.entries(results).map(([option, count]) => (
					<li key={option}>
						{option}: {count}
					</li>
				))}
			</ul>
		</div>
	);
};

export default Results;