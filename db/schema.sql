-- EderStone application database foundation
CREATE TABLE IF NOT EXISTS pos_state (
  id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data JSONB NOT NULL,
  version BIGINT NOT NULL DEFAULT 1 CHECK (version >= 1),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS pos_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL CHECK (jsonb_typeof(payload) IN ('object','array')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS pos_events_created_at_idx ON pos_events (created_at DESC);
CREATE INDEX IF NOT EXISTS pos_events_type_created_at_idx ON pos_events (event_type, created_at DESC);
CREATE TABLE IF NOT EXISTS mpesa_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkout_request_id TEXT NOT NULL UNIQUE,
  merchant_request_id TEXT,
  phone TEXT,
  amount BIGINT NOT NULL CHECK (amount > 0),
  account_reference TEXT NOT NULL,
  transaction_desc TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  result_code TEXT,
  result_message TEXT,
  mpesa_receipt TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS mpesa_transactions_status_idx ON mpesa_transactions (status, updated_at DESC);
CREATE INDEX IF NOT EXISTS mpesa_transactions_created_at_idx ON mpesa_transactions (created_at DESC);


-- Authentication and role foundation
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner','manager','cashier','kitchen','waiter','delivery','viewer')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);

CREATE TABLE IF NOT EXISTS role_permissions (
  role TEXT NOT NULL CHECK (role IN ('owner','manager','cashier','kitchen','waiter','delivery','viewer')),
  permission TEXT NOT NULL,
  PRIMARY KEY (role, permission)
);

INSERT INTO role_permissions (role, permission) VALUES
  ('owner','*'),
  ('manager','pos.read'),('manager','pos.write'),('manager','menu.manage'),('manager','inventory.manage'),('manager','reports.read'),('manager','staff.read'),
  ('cashier','pos.read'),('cashier','pos.write'),('cashier','receipts.read'),
  ('kitchen','pos.read'),('kitchen','kitchen.manage'),
  ('waiter','pos.read'),('waiter','orders.create'),
  ('delivery','delivery.read'),('delivery','delivery.update'),
  ('viewer','reports.read')
ON CONFLICT DO NOTHING;
