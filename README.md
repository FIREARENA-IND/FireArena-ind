# ARENAX.GG Static Tournament Site

This is a browser-only clone/prototype of the reference site with:

- esports landing page sections
- player register/login
- coin wallet
- QR recharge request flow
- admin approval for payments
- tournament join flow that deducts coins
- owner admin panel for content, QR, tournaments, users, and PIN

Open `index.html` in a browser to run it.

## Admin

Admin panel: `index.html#admin`

Default owner PIN: `2468`

Change the PIN from `Security` after opening the panel.

## Payment Flow

1. Open Admin Panel.
2. Go to `Payments`.
3. Add your QR image URL or upload your QR image.
4. Players recharge from the wallet section.
5. Admin approves a pending payment.
6. The player receives coins at `Rs 1 = 1 coin`.

## Important

This version stores data in the browser using `localStorage`, so it is perfect for preview and local testing. A production site that is truly admin-only needs backend authentication, a database, and real payment verification.
