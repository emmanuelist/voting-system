# Contributing to the Stacks Voting System

Thank you for considering contributing to the Stacks Voting System! Contributions are essential to making this project better for everyone, and I appreciate your interest.

## How to Contribute

1. **Fork the Repository:**

   - Fork the repository to your GitHub account and clone the project to your local environment.
   - Make sure you have the latest version of the `main` branch before starting any new work:
     ```bash
     git checkout main
     git pull origin main
     ```

2. **Create a Feature Branch:**

   - Use the `main` branch for production-ready code.
   - Create a new branch for each feature or bug fix:
     ```bash
     git checkout -b feature/your-feature-name
     ```

3. **Write Clear Code:**

   - Follow the project's coding conventions.
   - Ensure your code is well-documented and includes comments where necessary.
   - Use clear and meaningful variable/function names.

4. **Write Tests:**

   - Ensure any new functionality you add is covered by unit and/or integration tests.
   - If you are fixing a bug, write a test that confirms the bug has been fixed.
   - Tests should pass before submitting a pull request.

5. **Run Linting & Formatting:**

   - Run the project's linter to ensure the code adheres to style guidelines.
     ```bash
     npm run lint
     ```

6. **Open a Pull Request:**
   - Push your changes to your fork and submit a pull request.
   - Clearly describe the problem your change solves or the feature it adds.
   - Ensure your pull request passes continuous integration (CI) checks.

## Reporting Bugs or Issues

If you encounter any bugs or issues, please open an issue on GitHub. Provide as much detail as possible, including:

- Steps to reproduce the issue.
- The expected behavior.
- Any relevant error logs or screenshots.

## Code of Conduct

This project adheres to the Contributor Covenant Code of Conduct. By participating, you agree to uphold this code. Please report any unacceptable behavior to the repository maintainers.

We look forward to your contributions!

;; Data map to store votes
(define-map votes { voter: principal } { voted: bool })

;; Variable to store the total number of votes
(define-data-var total-votes uint u0)

;; Helper function to check if a user has already voted
(define-private (has-voted (sender principal))
  (is-some (map-get? votes { voter: sender })))

;; Public function for voting
(define-public (vote)
  (let ((sender tx-sender))
    (begin
      (asserts! (not (has-voted sender)) (err u100)) ;; Error u100 if user already voted
      (map-set votes { voter: sender } { voted: true }) ;; Store vote
      (var-set total-votes (+ (var-get total-votes) u1)) ;; Increment total votes
      (ok true)
    )))

;; Public function to unvote
(define-public (unvote)
  (let ((sender tx-sender))
    (begin
      (asserts! (has-voted sender) (err u101)) ;; Error u101 if user hasn't voted
      (map-delete votes { voter: sender }) ;; Remove vote
      (var-set total-votes (- (var-get total-votes) u1)) ;; Decrement total votes
      (ok true)
    )))
    
;; Getter function to retrieve the total number of votes
(define-public (get-total-votes)
  (ok (var-get total-votes)))
