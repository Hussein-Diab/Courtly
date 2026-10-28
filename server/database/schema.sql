-- Courtly database schema (MySQL 8+)
CREATE DATABASE IF NOT EXISTS courtly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE courtly;

-- 1) Users: one table for all three roles (player / owner / admin)
CREATE TABLE users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('player','owner','admin') NOT NULL DEFAULT 'player',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2) Sports: lookup table (football, basketball, tennis, padel...)
CREATE TABLE sports (
  id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- 3) Fields: each belongs to an owner; admin approves before it is public
CREATE TABLE fields (
  id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id       INT UNSIGNED NOT NULL,
  sport_id       INT UNSIGNED NOT NULL,
  name           VARCHAR(120) NOT NULL,
  description    TEXT,
  city           VARCHAR(80) NOT NULL,
  address        VARCHAR(255),
  latitude       DECIMAL(9,6),
  longitude      DECIMAL(9,6),
  price_per_hour DECIMAL(8,2) NOT NULL,
  status         ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (sport_id) REFERENCES sports(id),
  INDEX idx_fields_city_sport (city, sport_id, status)
);

CREATE TABLE field_images (
  id       INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  field_id INT UNSIGNED NOT NULL,
  url      VARCHAR(255) NOT NULL,
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 4) Opening hours per weekday (0 = Sunday ... 6 = Saturday)
CREATE TABLE field_opening_hours (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  field_id   INT UNSIGNED NOT NULL,
  weekday    TINYINT UNSIGNED NOT NULL,
  open_time  TIME NOT NULL,
  close_time TIME NOT NULL,
  UNIQUE KEY uq_field_day (field_id, weekday),
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 5) Bookings: overlap check is done in the service layer inside a transaction
CREATE TABLE bookings (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  field_id    INT UNSIGNED NOT NULL,
  user_id     INT UNSIGNED NOT NULL,
  start_at    DATETIME NOT NULL,
  end_at      DATETIME NOT NULL,
  total_price DECIMAL(8,2) NOT NULL,
  status      ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'confirmed',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  INDEX idx_bookings_field_time (field_id, start_at, end_at),
  INDEX idx_bookings_user (user_id, start_at)
);

-- 6) Favorites: many-to-many between users and fields
CREATE TABLE favorites (
  user_id    INT UNSIGNED NOT NULL,
  field_id   INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, field_id),
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE
);

-- 7) Reviews: one review per completed booking
CREATE TABLE reviews (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL UNIQUE,
  field_id   INT UNSIGNED NOT NULL,
  user_id    INT UNSIGNED NOT NULL,
  rating     TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment    TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (field_id)   REFERENCES fields(id)   ON DELETE CASCADE,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE
);

-- 8) Field views: feeds the analytics dashboards (popular fields, traffic)
CREATE TABLE field_views (
  id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  field_id  INT UNSIGNED NOT NULL,
  user_id   INT UNSIGNED NULL,
  viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (field_id) REFERENCES fields(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE SET NULL,
  INDEX idx_views_field_time (field_id, viewed_at)
);

INSERT INTO sports (name) VALUES ('Football'),('Basketball'),('Tennis'),('Padel'),('Volleyball');
