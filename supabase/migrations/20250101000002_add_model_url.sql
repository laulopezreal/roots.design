-- Add model_url column to products table
ALTER TABLE products ADD COLUMN model_url TEXT;

-- Update the specific product with the 3D model URL
UPDATE products 
SET model_url = 'https://res.cloudinary.com/dez0k7k6x/raw/upload/v1764936302/sam3d-splat_lcfkj3.splat'
WHERE id = '00000000-0000-0000-0000-000000000002';
