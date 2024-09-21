;; Define data variables
(define-data-var total-votes uint u0) ;; Total number of votes

;; Define data maps
(define-map votes principal bool) ;; Map to track if a user has voted

;; Define vote function
(define-public (vote)
  (let ((sender tx-sender))
    ;; Ensure the user has not already voted
    (asserts! (is-none (map-get? votes sender)) (err u100))
    ;; Record the user's vote
    (map-set votes sender true)
    ;; Increment the total votes
    (var-set total-votes (+ (var-get total-votes) u1))
    (ok true)))

;; Define get-total-votes function
(define-read-only (get-total-votes)
  ;; Return the total number of votes
  (ok (var-get total-votes)))