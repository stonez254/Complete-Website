-- Backfill the M-Pesa sale-link column for databases created before it was added.
ALTER TABLE mpesa_transactions
  ADD COLUMN IF NOT EXISTS pos_order_id TEXT UNIQUE;
