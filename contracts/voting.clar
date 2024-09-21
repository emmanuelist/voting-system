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
