;; Define the contract owner
(define-constant contract-owner tx-sender)

;; Data map to store votes
(define-map votes { voter: principal } { voted: bool })

;; Variable to store the total number of votes
(define-data-var total-votes uint u0)

;; Variable to store if voting is open
(define-data-var voting-open bool true)

;; Variable to store voting options
(define-data-var voting-options (list 10 (string-ascii 50)) (list))

;; Helper function to check if a user has already voted
(define-private (has-voted (sender principal))
  (is-some (map-get? votes { voter: sender })))

;; Helper function to validate voting option
(define-private (is-valid-option (option (string-ascii 50)))
  (and 
    (>= (len option) u1)
    (<= (len option) u50)))

;; Public function for voting
(define-public (vote)
  (let ((sender tx-sender))
    (begin
      (asserts! (var-get voting-open) (err u103)) ;; Error u103 if voting is closed
      (asserts! (not (has-voted sender)) (err u100)) ;; Error u100 if user already voted
      (asserts! (> (len (var-get voting-options)) u0) (err u105)) ;; Error u105 if no voting options
      (map-set votes { voter: sender } { voted: true }) ;; Store vote
      (var-set total-votes (+ (var-get total-votes) u1)) ;; Increment total votes
      (ok true))))

;; Public function to unvote
(define-public (unvote)
  (let ((sender tx-sender))
    (begin
      (asserts! (var-get voting-open) (err u103)) ;; Error u103 if voting is closed
      (asserts! (has-voted sender) (err u101)) ;; Error u101 if user hasn't voted
      (map-delete votes { voter: sender }) ;; Remove vote
      (var-set total-votes (- (var-get total-votes) u1)) ;; Decrement total votes
      (ok true))))

;; Getter function to retrieve the total number of votes
(define-read-only (get-total-votes)
  (ok (var-get total-votes)))

;; Public function to add a new voting option
(define-public (add-voting-option (option (string-ascii 50)))
  (let ((current-options (var-get voting-options)))
    (begin
      (asserts! (is-eq tx-sender contract-owner) (err u102)) ;; Only the contract owner can add options
      (asserts! (var-get voting-open) (err u103)) ;; Error u103 if voting is closed
      (asserts! (< (len current-options) u10) (err u104)) ;; Max 10 options
      (asserts! (is-valid-option option) (err u107)) ;; Error u107 if option is invalid
      (ok (var-set voting-options (unwrap! (as-max-len? (concat current-options (list option)) u10) (err u106)))))))

;; Public function to close voting
(define-public (close-voting)
  (begin
    (asserts! (is-eq tx-sender contract-owner) (err u102)) ;; Only the contract owner can close voting
    (var-set voting-open false) ;; Close voting
    (ok true)))

;; Read-only function to check if a voter has voted
(define-read-only (check-voter (voter principal))
  (is-some (map-get? votes { voter: voter })))

;; Read-only function to check if voting is open
(define-read-only (is-voting-open)
  (ok (var-get voting-open)))

;; Read-only function to get the voting options
(define-read-only (get-voting-options)
  (ok (var-get voting-options)))