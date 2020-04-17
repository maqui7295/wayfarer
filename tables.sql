DROP TABLE IF EXISTS users, bus, trips, bookings CASCADE;


CREATE TABLE users (
  id serial primary key,
  first_name varchar(128) not null,
  last_name varchar(128) not null,
  email varchar(200) unique,
  password varchar(80) not null,
  is_admin boolean not null default false,
  created_at timestamptz not null default CURRENT_TIMESTAMP,
  updated_at timestamptz
);


CREATE TABLE bus (
  id serial primary key,
  number_plate varchar(30) not null unique,
  manufacturer varchar(30),
  model varchar(30) not null,
  year varchar(5),
  capacity integer not null,
  created_at timestamptz not null default CURRENT_TIMESTAMP,
  updated_at timestamptz
);

CREATE TABLE trips (
  id serial primary key,
  bus_id integer REFERENCES bus (id) not null,
  user_id integer REFERENCES users (id) not null,
  origin varchar(50) not null,
  destination varchar(50) not null,
  trip_date timestamptz not null,
  fare real not null,
  seats json[] not null,
  status integer default 1,
  created_at timestamptz not null default CURRENT_TIMESTAMP,
  updated_at timestamptz
);

CREATE TABLE bookings (
  id serial primary key,
  trip_id integer not null REFERENCES trips (id) on delete cascade,
  user_id integer not null REFERENCES users (id) on delete cascade,
  seat_number int check (seat_number > 0),
  created_at timestamptz not null default CURRENT_TIMESTAMP,
  updated_at timestamptz,
  UNIQUE (trip_id, user_id, seat_number)
);




