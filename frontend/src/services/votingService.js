import { callReadOnlyFunction, stringAsciiCV } from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';

const contractAddress = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
const contractName = 'voting';

export const fetchVotingOptions = async () => {
	const options = await callReadOnlyFunction({
		contractAddress,
		contractName,
		functionName: 'get-voting-options',
		network: new StacksTestnet(),
	});
	return options.value.list;
};

export const fetchVoteCount = async (option) => {
	const count = await callReadOnlyFunction({
		contractAddress,
		contractName,
		functionName: 'get-vote-count',
		functionArgs: [stringAsciiCV(option)],
		network: new StacksTestnet(),
	});
	return count.value;
};