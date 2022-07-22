-- DB name: record_store  
-- DB user: robert (admin)

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE NOT NULL,
    password TEXT,
    email TEXT UNIQUE,
    ip CIDR,
    stripe_id TEXT UNIQUE,
    role TEXT DEFAULT 'user',
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    registered TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customer_addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    first TEXT,
    last TEXT,
    city TEXT,
    postcode TEXT,
    country TEXT,
    street TEXT
);


CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    artist TEXT,
    title TEXT NOT NULL,
    release_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    press TEXT,
    cover TEXT,
    discount FLOAT DEFAULT 0.1,
    catalogue TEXT
);


CREATE TABLE tracks (
    id SERIAL PRIMARY KEY,
    title TEXT,
    album_id INTEGER REFERENCES albums(id) ON DELETE CASCADE NOT NULL,
    playtime TIME,
    price FLOAT NOT NULL DEFAULT 0.99,
    sample TEXT
);

CREATE TABLE cart ( 
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    modified TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);  

CREATE TABLE cart_item (
    id SERIAL PRIMARY KEY,
    cart_id INT REFERENCES cart(id) ON DELETE CASCADE NOT NULL ,
    track_id INT REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    total FLOAT NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_item (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    track_id INT REFERENCES tracks(id) ON DELETE CASCADE,
    price FLOAT NOT NULL,
    created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

