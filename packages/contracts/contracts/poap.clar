;; POAP (Proof of Attendance Protocol) Contract
;; Implements SIP009 NFT trait for attendance badges
;; Clarity 3 - Nakamoto

(use-trait nft-trait .sip009-nft-trait.nft-trait)
(impl-trait .sip009-nft-trait.nft-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-token-not-found (err u102))
(define-constant err-event-not-found (err u103))
(define-constant err-already-claimed (err u104))
(define-constant err-event-not-active (err u105))
(define-constant err-unauthorized (err u106))
(define-constant err-max-attendees-reached (err u107))
(define-constant err-invalid-params (err u108))

;; Data Variables
(define-data-var last-token-id uint u0)
(define-data-var last-event-id uint u0)

;; Data Maps
(define-map tokens
  { token-id: uint }
  {
    owner: principal,
    event-id: uint,
  }
)

(define-map events
  { event-id: uint }
  {
    name: (string-utf8 100),
    description: (string-utf8 500),
    image-uri: (string-ascii 256),
    organizer: principal,
    start-time: uint,
    end-time: uint,
    active: bool,
    max-attendees: uint,
    current-attendees: uint,
  }
)

(define-map event-attendees
  {
    event-id: uint,
    attendee: principal,
  }
  {
    claimed: bool,
    claim-time: uint,
  }
)

(define-map token-metadata
  { token-id: uint }
  { uri: (string-ascii 256) }
)

;; SIP009 Functions

(define-read-only (get-last-token-id)
  (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
  (ok (get uri (map-get? token-metadata { token-id: token-id })))
)

(define-read-only (get-owner (token-id uint))
  (ok (get owner (map-get? tokens { token-id: token-id })))
)

(define-public (transfer
    (token-id uint)
    (sender principal)
    (recipient principal)
  )
  (let ((token-owner (unwrap! (get-owner token-id) err-token-not-found)))
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (asserts! (is-eq (some sender) token-owner) err-not-token-owner)
    (asserts! (is-eq recipient recipient) err-invalid-params)
    (map-set tokens { token-id: token-id } {
      owner: recipient,
      event-id: (get event-id
        (unwrap! (map-get? tokens { token-id: token-id }) err-token-not-found)
      ),
    })
    (ok true)
  )
)

;; Event Management Functions

(define-public (create-event
    (name (string-utf8 100))
    (description (string-utf8 500))
    (image-uri (string-ascii 256))
    (start-time uint)
    (end-time uint)
    (max-attendees uint)
  )
  (let ((event-id (+ (var-get last-event-id) u1)))
    (asserts! (> (len name) u0) err-invalid-params)
    (asserts! (> (len description) u0) err-invalid-params)
    (asserts! (> (len image-uri) u0) err-invalid-params)
    (asserts! (< start-time end-time) err-invalid-params)
    (asserts! (> max-attendees u0) err-invalid-params)
    (map-set events { event-id: event-id } {
      name: name,
      description: description,
      image-uri: image-uri,
      organizer: tx-sender,
      start-time: start-time,
      end-time: end-time,
      active: true,
      max-attendees: max-attendees,
      current-attendees: u0,
    })
    (var-set last-event-id event-id)
    (ok event-id)
  )
)

(define-public (update-event-status
    (event-id uint)
    (active bool)
  )
  (let ((event (unwrap! (map-get? events { event-id: event-id }) err-event-not-found)))
    (asserts! (is-eq tx-sender (get organizer event)) err-unauthorized)
    (asserts! (is-some (map-get? events { event-id: event-id }))
      err-event-not-found
    )
    (map-set events { event-id: event-id } (merge event { active: active }))
    (ok true)
  )
)

;; Badge Claiming Functions

(define-public (claim-badge (event-id uint))
  (let (
      (event (unwrap! (map-get? events { event-id: event-id }) err-event-not-found))
      (token-id (+ (var-get last-token-id) u1))
      (current-attendees (get current-attendees event))
    )
    ;; Check if event is active
    (asserts! (get active event) err-event-not-active)

    ;; Check if already claimed
    (asserts!
      (is-none (map-get? event-attendees {
        event-id: event-id,
        attendee: tx-sender,
      }))
      err-already-claimed
    )

    ;; Check if max attendees reached
    (asserts! (< current-attendees (get max-attendees event))
      err-max-attendees-reached
    )

    ;; Mint the badge
    (map-set tokens { token-id: token-id } {
      owner: tx-sender,
      event-id: event-id,
    })

    ;; Set token URI
    (map-set token-metadata { token-id: token-id } { uri: (get image-uri event) })

    ;; Record attendance
    (map-set event-attendees {
      event-id: event-id,
      attendee: tx-sender,
    } {
      claimed: true,
      claim-time: stacks-block-height,
    })

    ;; Update event attendee count
    (map-set events { event-id: event-id }
      (merge event { current-attendees: (+ current-attendees u1) })
    )

    (var-set last-token-id token-id)
    (ok token-id)
  )
)

;; Read-only Functions

(define-read-only (get-event (event-id uint))
  (ok (map-get? events { event-id: event-id }))
)

(define-read-only (has-claimed-badge
    (event-id uint)
    (attendee principal)
  )
  (ok (is-some (map-get? event-attendees {
    event-id: event-id,
    attendee: attendee,
  })))
)

(define-read-only (get-token-event (token-id uint))
  (ok (get event-id (map-get? tokens { token-id: token-id })))
)

(define-read-only (get-user-badges (user principal))
  ;; This would need to be implemented with a more complex iteration
  ;; For now, returns success - can be enhanced with off-chain indexing
  (ok true)
)
