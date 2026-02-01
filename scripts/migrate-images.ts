/**
 * Migration script to upload product images from /public/images/ to Supabase Storage
 * and update the Product table with new URLs.
 *
 * Run with: npx tsx scripts/migrate-images.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
import "dotenv/config";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Images to migrate (excluding logo.svg and hero_img.jpg)
const IMAGES_TO_MIGRATE = [
  "img1.jpg",
  "img2.jpg",
  "img3.jpg",
  "img4.jpg",
  "img5.jpg",
  "img6.jpg",
];

const IMAGES_DIR = path.join(process.cwd(), "public", "images");

async function uploadImage(filename: string): Promise<string | null> {
  const filePath = path.join(IMAGES_DIR, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return null;
  }

  const fileBuffer = fs.readFileSync(filePath);
  const contentType = "image/jpeg";

  // Upload to Supabase Storage with same filename for consistency
  const { error } = await supabase.storage
    .from("products")
    .upload(filename, fileBuffer, {
      contentType,
      upsert: true, // Overwrite if exists
    });

  if (error) {
    console.error(`Failed to upload ${filename}:`, error.message);
    return null;
  }

  // Get public URL
  const { data } = supabase.storage.from("products").getPublicUrl(filename);

  console.log(`✓ Uploaded ${filename} → ${data.publicUrl}`);
  return data.publicUrl;
}

async function updateProductImages(urlMap: Map<string, string>) {
  // Get all products
  const { data: products, error: fetchError } = await supabase
    .from("Product")
    .select("id, name, image");

  if (fetchError) {
    console.error("Failed to fetch products:", fetchError.message);
    return;
  }

  console.log(`\nUpdating ${products.length} products...`);

  for (const product of products) {
    const oldPath = product.image;

    // Extract filename from path like "/images/img1.jpg"
    const filename = oldPath.split("/").pop();
    const newUrl = urlMap.get(filename || "");

    if (newUrl) {
      const { error: updateError } = await supabase
        .from("Product")
        .update({ image: newUrl })
        .eq("id", product.id);

      if (updateError) {
        console.error(
          `Failed to update product ${product.id} (${product.name}):`,
          updateError.message
        );
      } else {
        console.log(`✓ Updated ${product.name}: ${oldPath} → ${newUrl}`);
      }
    } else {
      console.warn(`⚠ No mapping found for ${product.name}: ${oldPath}`);
    }
  }
}

async function main() {
  console.log("Starting image migration to Supabase Storage...\n");

  // Step 1: Upload images
  const urlMap = new Map<string, string>();

  for (const filename of IMAGES_TO_MIGRATE) {
    const url = await uploadImage(filename);
    if (url) {
      urlMap.set(filename, url);
    }
  }

  console.log(`\nUploaded ${urlMap.size}/${IMAGES_TO_MIGRATE.length} images`);

  if (urlMap.size === 0) {
    console.error("No images uploaded. Aborting database update.");
    process.exit(1);
  }

  // Step 2: Update product records
  await updateProductImages(urlMap);

  console.log("\n✓ Migration complete!");
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
