# Stacks Decentralized Voting System

This project is a decentralized voting system built on the Stacks blockchain. It leverages **Clarity smart contracts** for secure voting functionality and **React** for a user-friendly frontend interface. Voters can choose from predefined options, and once the voting is closed, no further votes can be submitted. This repository also includes unit and integration tests, deployment scripts, and CI integration for seamless development.

## Table of Contents

- [Stacks Decentralized Voting System](#stacks-decentralized-voting-system)
	- [Table of Contents](#table-of-contents)
	- [Project Structure](#project-structure)
	- [Features](#features)
	- [Getting Started](#getting-started)
		- [Prerequisites](#prerequisites)
		- [Installation](#installation)
		- [Running Tests](#running-tests)
		- [Deploying Contracts](#deploying-contracts)
		- [Running Frontend](#running-frontend)
	- [Smart Contracts](#smart-contracts)
		- [Voting Contract (`voting.clar`)](#voting-contract-votingclar)
		- [Voter Trait (`voter-trait.clar`)](#voter-trait-voter-traitclar)
	- [CI/CD Integration](#cicd-integration)
		- [Configuration](#configuration)
	- [Contributing](#contributing)
	- [License](#license)

## Project Structure

```
voting-system/
├── contracts/
│   ├── voting.clar
│   └── traits/
│       └── voter-trait.clar
├── tests/
│   ├── voting_test.ts
│   └── integration_test.ts
├── scripts/
│   ├── deploy.js
│   └── interact.js
├── frontend/
├── docs/
├── .github/
│   └── workflows/ci.yml
├── Clarinet.toml
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## Features

- **Decentralized voting**: Each voter can cast a single vote on one of the available options.
- **Clarity Smart Contracts**: Secure, transparent voting mechanisms powered by Clarity.
- **React-based frontend**: Interactive web interface for submitting votes.
- **Unit & Integration Tests**: Comprehensive testing suite using **Clarinet**.
- **Continuous Integration**: Automatically runs tests and linting on every commit.

## Getting Started

### Prerequisites

Make sure you have the following tools installed on your machine:

- **Node.js** (>= v14)
- **npm** (or **yarn**)
- **Clarinet** for Clarity smart contract development:
  ```bash
  curl --proto '=https' --tlsv1.2 -sSf https://sh.clarinet.stacks.co | sh
  ```
- **Stacks Wallet** for testing on the blockchain

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/benedict-drio/voting-system.git
   cd voting-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Initialize the frontend project:
   ```bash
   cd frontend
   npx create-react-app .
   npm install @stacks/connect @stacks/transactions
   ```

### Running Tests

Unit tests and integration tests for the smart contracts can be run with Clarinet.

1. Run unit tests:

   ```bash
   clarinet test
   ```

2. To run TypeScript tests:
   ```bash
   npm test
   ```

### Deploying Contracts

To deploy the voting contract to a Stacks blockchain:

1. Update the private key and contract address in `scripts/deploy.js`.

2. Deploy the contract:
   ```bash
   node scripts/deploy.js
   ```

### Running Frontend

To run the frontend locally:

1. Start the development server:
   ```bash
   cd frontend
   npm start
   ```
2. Navigate to `http://localhost:3000` to interact with the voting system.

## Smart Contracts

### Voting Contract (`voting.clar`)

This contract implements the core voting functionality. Voters can submit a vote for one of the available options, and each voter can only vote once. Voting options are predefined, and the contract owner can close the voting process once it’s over.

Example of adding a new voting option:

```clarity
(define-public (add-voting-option (option (string-ascii 50)))
  (begin
    (asserts! (is-eq tx-sender (contract-owner)) ERR_UNAUTHORIZED)
    (asserts! (< (len (var-get voting-options)) u10) (err u104))
    (var-set voting-options (append (var-get voting-options) option))
    (ok true)))
```

### Voter Trait (`voter-trait.clar`)

This contract defines the **voter-trait**, which specifies a function `vote`. Any contract that interacts with the voting system must implement this trait.

```clarity
(define-trait voter-trait
  (
    (vote (string-ascii 50) (response bool uint))
  )
)
```

## CI/CD Integration

This project uses GitHub Actions for continuous integration. Each push or pull request triggers a build that runs unit tests, integration tests, and linting.

### Configuration

The CI workflow is defined in `.github/workflows/ci.yml`.

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "14"
      - run: npm ci
      - run: npm test
```

## Contributing

We welcome contributions! Please see the [CONTRIBUTING.md](docs/CONTRIBUTING.md) file for guidelines on how to get started.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
