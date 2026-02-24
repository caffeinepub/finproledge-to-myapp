# Specification

## Summary
**Goal:** Add multi-currency and card type selection to the client payment form, store these fields in payment records, and allow the admin to configure a PayPal receiving account through the admin portal.

**Planned changes:**
- Update `PaymentForm` to include a currency selector dropdown (USD, EUR, GBP, CAD, AUD, JPY, CHF, and more) and card type options (Visa, Mastercard, Amex, Discover, etc.)
- Update the backend `Payment` data type and `createPayment` function to store `currency` and `paymentMethod` fields
- Update `AdminPaymentSettings` to include a clearly labeled "PayPal Receiving Account" email field that is validated, saved to the backend, and pre-populated on revisit
- Update `AdminPaymentTable` to display the currency code alongside each payment amount and show the card/payment method used
- Update `PaymentHistoryTable` on the client side to also show currency and payment method per record

**User-visible outcome:** Clients can select their preferred currency and card type when submitting a payment. Admins can configure their PayPal receiving account in the admin portal and see each payment's currency and card type in the payment table.
