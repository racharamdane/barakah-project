-- ============================================================
--  Barakah Seed Data — Algerian cities + sample records
-- ============================================================

-- ------------------------------------------------------------
-- Cities (all 48 wilaya capitals + major cities)
-- ------------------------------------------------------------
INSERT OR IGNORE INTO cities (name) VALUES
  ('Alger'),('Oran'),('Constantine'),('Annaba'),('Blida'),
  ('Batna'),('Djelfa'),('Sétif'),('Sidi Bel Abbès'),('Biskra'),
  ('Tébessa'),('Tlemcen'),('Béjaïa'),('Skikda'),('Tiaret'),
  ('Mostaganem'),('Médéa'),('Ouargla'),('Chlef'),('Msila'),
  ('Mascara'),('Guelma'),('Souk Ahras'),('Jijel'),('Relizane'),
  ('Saïda'),('Boumerdès'),('Khenchela'),('Tissemsilt'),('Bouira'),
  ('Tizi Ouzou'),('Bordj Bou Arréridj'),('Adrar'),('Ain Defla'),
  ('Ain Témouchent'),('El Bayadh'),('El Oued'),('El Tarf'),
  ('Ghardaïa'),('Illizi'),('Khenchela'),('Laghouat'),('Mila'),
  ('Naâma'),('Tindouf'),('Tipaza'),('Tlemcen'),('El Eulma');

-- ------------------------------------------------------------
-- Sample restaurants (passwords are bcrypt of "password123")
-- ------------------------------------------------------------
INSERT OR IGNORE INTO restaurants (name, email, phone, city_id, password_hash, is_active)
VALUES
  (
    'Boulangerie El Warda',
    'elwarda@example.com',
    '0550123456',
    1,  -- Alger
    '$2b$10$YourHashHere_replace_on_real_seed',
    1
  ),
  (
    'Pizza Chez Karim',
    'karim.pizza@example.com',
    '0661234567',
    2,  -- Oran
    '$2b$10$YourHashHere_replace_on_real_seed',
    1
  ),
  (
    'Restaurant Constantinois',
    'resto.const@example.com',
    '0772345678',
    3,  -- Constantine
    '$2b$10$YourHashHere_replace_on_real_seed',
    1
  );

-- ------------------------------------------------------------
-- Sample offers
-- (restaurant_id must match rows above; adjust IDs after real insert)
-- ------------------------------------------------------------
-- These are illustrative — the real app inserts via API
-- INSERT INTO offers (restaurant_id, original_price, reduced_price, total_bags, bags_remaining, collection_start, collection_end, description)
-- VALUES
--   (1, 800, 350, 5, 5, '19:00', '20:30', 'Assortiment de pains et viennoiseries du jour'),
--   (2, 1200, 500, 3, 3, '21:00', '22:00', 'Pizzas variées, surprise garantie !'),
--   (3, 1500, 600, 4, 4, '20:30', '21:30', 'Plats traditionnels constantinois');
