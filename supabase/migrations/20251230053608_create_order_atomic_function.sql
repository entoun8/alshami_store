-- Create atomic order creation function
-- This ensures EITHER all steps succeed OR nothing happens (no partial orders)
-- Applied via Supabase MCP on 2025-12-30

CREATE OR REPLACE FUNCTION create_order_atomic(
  p_user_id UUID,
  p_shipping_address JSONB,
  p_payment_method TEXT,
  p_items_price NUMERIC,
  p_shipping_price NUMERIC,
  p_tax_price NUMERIC,
  p_total_price NUMERIC,
  p_order_items JSONB,
  p_cart_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
  v_order_id UUID;
  v_item JSONB;
BEGIN
  -- Step 1: Create the order
  INSERT INTO "order" (
    user_id,
    shipping_address,
    payment_method,
    items_price,
    shipping_price,
    tax_price,
    total_price
  )
  VALUES (
    p_user_id,
    p_shipping_address,
    p_payment_method,
    p_items_price,
    p_shipping_price,
    p_tax_price,
    p_total_price
  )
  RETURNING id INTO v_order_id;

  -- Step 2: Create all order items (loop through the JSON array)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_order_items)
  LOOP
    INSERT INTO order_item (
      order_id,
      product_id,
      name,
      slug,
      quantity,
      price,
      image
    )
    VALUES (
      v_order_id,
      (v_item->>'product_id')::BIGINT,
      v_item->>'name',
      v_item->>'slug',
      (v_item->>'quantity')::INTEGER,
      (v_item->>'price')::NUMERIC,
      v_item->>'image'
    );
  END LOOP;

  -- Step 3: Clear the cart
  UPDATE cart
  SET
    items = '[]'::jsonb,
    items_price = 0,
    shipping_price = 0,
    tax_price = 0,
    total_price = 0
  WHERE id = p_cart_id;

  -- Return the order ID
  RETURN v_order_id;

  -- Note: PostgreSQL automatically rolls back EVERYTHING if any step fails
END;
$$;
