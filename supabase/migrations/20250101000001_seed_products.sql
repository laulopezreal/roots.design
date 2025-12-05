-- Insert products
INSERT INTO products (id, name, brand, designer, price, category, collection, finish, tags, featured, featured_rank, in_stock, inventory_count)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'ANC66 Side Table', 'Heilig Objects', NULL, 249.00, 'side_table', 'The Collection', NULL, ARRAY['heilig objects', 'design'], true, 1, true, 10),
  ('00000000-0000-0000-0000-000000000002', 'Armchair - Dunas XL', 'InClass', NULL, 189.00, 'chairs', 'The Collection', NULL, ARRAY['chair', 'armchair'], true, 2, true, 5);

-- Insert product images
INSERT INTO product_images (product_id, cloudinary_public_id, alt_text, display_order, widths, sizes)
VALUES
  ('00000000-0000-0000-0000-000000000001', '2507-1_le16yg.jpg', 'Brass pendant lamp suspended above a marble table', 0, ARRAY[400, 800, 1200, 1600], '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px'),
  ('00000000-0000-0000-0000-000000000002', 'gem-1-2510_wofqln.png', 'Curved upholstered armchair with wooden legs', 0, ARRAY[400, 800, 1200, 1600], '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px');
