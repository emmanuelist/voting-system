;; Define unvote function
(define-public (unvote)
  (let ((sender tx-sender))
    (asserts! (is-some (map-get? votes sender)) (err u101))
    (map-delete votes sender)
    (var-set total-votes (- (var-get total-votes) u1))
    (ok true)))