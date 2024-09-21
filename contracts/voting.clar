;; Helper function to check if user has already voted
(define-private (has-voted (sender principal))
  (is-some (map-get? votes sender)))

;; Refactored vote function
(define-public (vote)
  (let ((sender tx-sender))
    (asserts! (not (has-voted sender)) (err u100))
    (map-set votes sender true)
    (var-set total-votes (+ (var-get total-votes) u1))
    (ok true)))