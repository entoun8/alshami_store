import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const dummyProducts = [
  {
    name: "Premium Arabic Coffee Beans",
    slug: "premium-arabic-coffee-beans",
    category: "Coffee",
    image: "/images/img1.jpg",
    brand: "Alshami",
    description:
      "Premium quality Arabic coffee beans sourced from the finest farms. Rich aroma and bold flavor perfect for traditional coffee lovers.",
    stock: 50,
    price: 29.99,
  },
  {
    name: "Organic Green Cardamom",
    slug: "organic-green-cardamom",
    category: "Spices",
    image: "/images/img2.jpg",
    brand: "Alshami",
    description:
      "Highest quality organic green cardamom pods. Perfect for enhancing coffee, tea, and traditional dishes with authentic Middle Eastern flavor.",
    stock: 100,
    price: 15.99,
  },
  {
    name: "Traditional Saffron Threads",
    slug: "traditional-saffron-threads",
    category: "Spices",
    image: "/images/img3.jpg",
    brand: "Alshami Premium",
    description:
      "Pure saffron threads handpicked from the best harvests. Adds rich color and distinctive flavor to your dishes and beverages.",
    stock: 30,
    price: 49.99,
  },
  {
    name: "Turkish Coffee - Dark Roast",
    slug: "turkish-coffee-dark-roast",
    category: "Coffee",
    image: "/images/img4.jpg",
    brand: "Alshami",
    description:
      "Finely ground dark roast Turkish coffee. Perfect for traditional preparation with a rich, bold taste and smooth finish.",
    stock: 75,
    price: 19.99,
  },
  {
    name: "Dried Mint Leaves",
    slug: "dried-mint-leaves",
    category: "Herbs",
    image: "/images/img5.jpg",
    brand: "Alshami Organic",
    description:
      "Premium dried mint leaves perfect for tea, cooking, and traditional Middle Eastern recipes. Fresh aroma and flavor guaranteed.",
    stock: 120,
    price: 8.99,
  },
  {
    name: "Za'atar Spice Blend",
    slug: "zaatar-spice-blend",
    category: "Spices",
    image: "/images/img6.jpg",
    brand: "Alshami",
    description:
      "Authentic Za'atar blend with thyme, sesame, sumac, and salt. Perfect for bread, meats, vegetables, and traditional Middle Eastern dishes.",
    stock: 85,
    price: 12.99,
  },
  {
    name: "Premium Espresso Blend",
    slug: "premium-espresso-blend",
    category: "Coffee",
    image: "/images/img1.jpg",
    brand: "Alshami Premium",
    description:
      "Carefully crafted espresso blend with notes of chocolate and caramel. Perfect for espresso machines and traditional coffee preparation.",
    stock: 60,
    price: 34.99,
  },
  {
    name: "Whole Cloves",
    slug: "whole-cloves",
    category: "Spices",
    image: "/images/img2.jpg",
    brand: "Alshami",
    description:
      "Premium whole cloves with intense aroma and flavor. Essential for traditional cooking, baking, and hot beverages.",
    stock: 95,
    price: 9.99,
  },
  {
    name: "Chamomile Flowers",
    slug: "chamomile-flowers",
    category: "Herbs",
    image: "/images/img3.jpg",
    brand: "Alshami Organic",
    description:
      "Organic dried chamomile flowers for a soothing, calming tea. Perfect for relaxation and traditional herbal remedies.",
    stock: 110,
    price: 11.99,
  },
  {
    name: "Ground Cinnamon",
    slug: "ground-cinnamon",
    category: "Spices",
    image: "/images/img4.jpg",
    brand: "Alshami",
    description:
      "Premium ground cinnamon with sweet, warm flavor. Perfect for coffee, desserts, and traditional Middle Eastern dishes.",
    stock: 140,
    price: 7.99,
  },
  {
    name: "Black Pepper Whole",
    slug: "black-pepper-whole",
    category: "Spices",
    image: "/images/img5.jpg",
    brand: "Alshami",
    description:
      "Whole black peppercorns with robust flavor and aroma. Freshly grind for maximum flavor in all your dishes.",
    stock: 125,
    price: 6.99,
  },
  {
    name: "Loose Leaf Green Tea",
    slug: "loose-leaf-green-tea",
    category: "Tea",
    image: "/images/img6.jpg",
    brand: "Alshami Premium",
    description:
      "Premium loose leaf green tea with delicate flavor and natural antioxidants. Perfect for traditional tea preparation.",
    stock: 70,
    price: 16.99,
  },
];

async function seedProducts() {
  console.log("🌱 Starting to seed products...");

  try {
    // Insert products
    const { data, error } = await supabase
      .from("Product")
      .insert(dummyProducts)
      .select();

    if (error) {
      console.error("❌ Error seeding products:", error);
      process.exit(1);
    }

    console.log(`✅ Successfully seeded ${data?.length} products!`);
    console.log("\nSeeded products:");
    data?.forEach((product) => {
      console.log(`  - ${product.name} (${product.slug})`);
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts();
