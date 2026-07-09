-- V1 Initial Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    enabled BOOLEAN DEFAULT TRUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    balance DECIMAL(19,2) NOT NULL DEFAULT 0.00,
    institution VARCHAR(100),
    account_number VARCHAR(50),
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_category_name_type UNIQUE (name, type)
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    account_id BIGINT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    amount DECIMAL(19,2) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    transaction_date DATE NOT NULL,
    to_account_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_transactions_to_account_id ON transactions(to_account_id);
CREATE INDEX idx_transactions_category_id ON transactions(category_id);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);

-- Seed default categories
INSERT INTO categories (name, type) VALUES
    ('Salary', 'INCOME'),
    ('Freelance', 'INCOME'),
    ('Investments', 'INCOME'),
    ('Gifts', 'INCOME'),
    ('Other Income', 'INCOME')
ON CONFLICT (name, type) DO NOTHING;

INSERT INTO categories (name, type) VALUES
    ('Food & Dining', 'EXPENSE'),
    ('Transportation', 'EXPENSE'),
    ('Entertainment', 'EXPENSE'),
    ('Utilities', 'EXPENSE'),
    ('Rent/Mortgage', 'EXPENSE'),
    ('Shopping', 'EXPENSE'),
    ('Healthcare', 'EXPENSE'),
    ('Personal Care', 'EXPENSE'),
    ('Education', 'EXPENSE'),
    ('Travel', 'EXPENSE'),
    ('Other Expenses', 'EXPENSE')
ON CONFLICT (name, type) DO NOTHING;
