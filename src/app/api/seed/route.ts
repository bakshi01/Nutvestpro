import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const sampleProducts = [
  {
    name: "Premium Almonds",
    description:
      "Handpicked premium quality almonds from the finest orchards. Rich in Vitamin E, fiber, and healthy fats. Perfect for snacking or adding to your favorite recipes.",
    price: 899,
    comparePrice: 1199,
    category: "Almonds",
    image: "/products/almonds.jpg",
    weight: "250g",
    stock: 50,
    featured: true,
    rating: 4.8,
    reviews: 124,
  },
  {
    name: "Jumbo Cashews",
    description:
      "Whole jumbo cashews roasted to perfection. Creamy, buttery flavor with a satisfying crunch. Sourced from premium farms for the best quality.",
    price: 1099,
    comparePrice: 1399,
    category: "Cashews",
    image: "/products/cashews.jpg",
    weight: "250g",
    stock: 35,
    featured: true,
    rating: 4.7,
    reviews: 98,
  },
  {
    name: "Kashmiri Walnuts",
    description:
      "Authentic Kashmiri walnuts with rich, earthy flavor. High in Omega-3 fatty acids and antioxidants. Perfect for brain health and baking.",
    price: 749,
    comparePrice: 999,
    category: "Walnuts",
    image: "/products/walnuts.jpg",
    weight: "250g",
    stock: 40,
    featured: false,
    rating: 4.6,
    reviews: 76,
  },
  {
    name: "Iranian Pistachios",
    description:
      "Premium Iranian pistachios with naturally open shells. Vibrant green color, rich flavor, and perfect crunch. The king of nuts.",
    price: 1299,
    comparePrice: 1599,
    category: "Pistachios",
    image: "/products/pistachios.jpg",
    weight: "250g",
    stock: 25,
    featured: true,
    rating: 4.9,
    reviews: 156,
  },
  {
    name: "Kashmiri Saffron",
    description:
      "Pure Kashmiri saffron threads, the world's most precious spice. Intense aroma, vibrant color, and authentic flavor for your culinary masterpieces.",
    price: 2499,
    comparePrice: 2999,
    category: "Saffron",
    image: "/products/saffron.jpg",
    weight: "1g",
    stock: 15,
    featured: true,
    rating: 4.9,
    reviews: 203,
  },
  {
    name: "Golden Raisins",
    description:
      "Sun-dried golden raisins with natural sweetness. Rich in iron and energy-boosting nutrients. A healthy snack for all ages.",
    price: 599,
    comparePrice: 799,
    category: "Raisins",
    image: "/products/raisins.jpg",
    weight: "250g",
    stock: 60,
    featured: false,
    rating: 4.5,
    reviews: 54,
  },
  {
    name: "Afghan Dried Figs",
    description:
      "Naturally dried Afghan figs with a luscious, honey-like sweetness. Packed with dietary fiber, vitamins, and minerals for wholesome nutrition.",
    price: 699,
    comparePrice: 899,
    category: "Figs",
    image: "/products/figs.jpg",
    weight: "250g",
    stock: 30,
    featured: false,
    rating: 4.4,
    reviews: 42,
  },
  {
    name: "Cedar Pine Nuts",
    description:
      "Delicate cedar pine nuts with a buttery, subtle flavor. Essential for pesto and gourmet cooking. Carefully selected for premium quality.",
    price: 1899,
    comparePrice: 2299,
    category: "Pine Nuts",
    image: "/products/pinenuts.jpg",
    weight: "250g",
    stock: 20,
    featured: true,
    rating: 4.7,
    reviews: 67,
  },
  {
    name: "Royal Mixed Dry Fruits",
    description:
      "A luxurious blend of premium almonds, cashews, pistachios, raisins, and walnuts. The perfect gift and the ultimate snacking experience.",
    price: 1499,
    comparePrice: 1899,
    category: "Mixed",
    image: "/products/mixed.jpg",
    weight: "500g",
    stock: 45,
    featured: true,
    rating: 4.8,
    reviews: 189,
  },
  {
    name: "Turkish Dried Apricots",
    description:
      "Sun-ripened Turkish apricots dried to perfection. Sweet, tangy, and rich in potassium and fiber. Nature's candy at its finest.",
    price: 649,
    comparePrice: 849,
    category: "Apricots",
    image: "/products/apricots.jpg",
    weight: "250g",
    stock: 55,
    featured: false,
    rating: 4.5,
    reviews: 61,
  },
  {
    name: "Medjool Dates",
    description:
      "Premium Medjool dates — nature's sweetest treat. Soft, caramel-like texture with rich flavor. High in fiber, potassium, and natural energy.",
    price: 999,
    comparePrice: 1299,
    category: "Dates",
    image: "/products/dates.jpg",
    weight: "500g",
    stock: 38,
    featured: false,
    rating: 4.6,
    reviews: 88,
  },
  {
    name: "Trail Mix Premium",
    description:
      "A carefully crafted blend of nuts, seeds, dried fruits, and dark chocolate chips. The perfect on-the-go energy booster for active lifestyles.",
    price: 849,
    comparePrice: 1099,
    category: "Mixed",
    image: "/products/mixed.jpg",
    weight: "250g",
    stock: 42,
    featured: false,
    rating: 4.5,
    reviews: 73,
  },
];

export async function GET() {
  try {
    // Check if products already exist
    const existing = await db.product.count();
    if (existing > 0) {
      return NextResponse.json({
        message: `Database already has ${existing} products. Skipping seed.`,
        count: existing,
      });
    }

    const products = await db.product.createMany({
      data: sampleProducts,
    });

    // Create some sample orders for analytics
    const sampleOrders = [
      {
        customerName: "Rahul Sharma",
        customerPhone: "+919876543210",
        customerEmail: "rahul@email.com",
        customerAddress: "Mumbai, Maharashtra",
        items: JSON.stringify([
          { name: "Premium Almonds", quantity: 2, price: 899 },
          { name: "Jumbo Cashews", quantity: 1, price: 1099 },
        ]),
        totalAmount: 2897,
        status: "delivered",
        whatsappSent: true,
        createdAt: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 3,
          15
        ),
      },
      {
        customerName: "Priya Patel",
        customerPhone: "+919876543211",
        customerEmail: "priya@email.com",
        customerAddress: "Ahmedabad, Gujarat",
        items: JSON.stringify([
          { name: "Kashmiri Saffron", quantity: 1, price: 2499 },
          { name: "Royal Mixed Dry Fruits", quantity: 2, price: 1499 },
        ]),
        totalAmount: 5497,
        status: "delivered",
        whatsappSent: true,
        createdAt: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 2,
          10
        ),
      },
      {
        customerName: "Amit Kumar",
        customerPhone: "+919876543212",
        customerEmail: "amit@email.com",
        customerAddress: "Delhi, NCR",
        items: JSON.stringify([
          { name: "Iranian Pistachios", quantity: 1, price: 1299 },
        ]),
        totalAmount: 1299,
        status: "shipped",
        whatsappSent: true,
        createdAt: new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          20
        ),
      },
      {
        customerName: "Sneha Reddy",
        customerPhone: "+919876543213",
        customerEmail: "sneha@email.com",
        customerAddress: "Hyderabad, Telangana",
        items: JSON.stringify([
          { name: "Medjool Dates", quantity: 3, price: 999 },
          { name: "Golden Raisins", quantity: 2, price: 599 },
        ]),
        totalAmount: 4195,
        status: "confirmed",
        whatsappSent: true,
        createdAt: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          5
        ),
      },
      {
        customerName: "Vikram Singh",
        customerPhone: "+919876543214",
        customerEmail: "vikram@email.com",
        customerAddress: "Jaipur, Rajasthan",
        items: JSON.stringify([
          { name: "Cedar Pine Nuts", quantity: 1, price: 1899 },
          { name: "Trail Mix Premium", quantity: 2, price: 849 },
          { name: "Kashmiri Walnuts", quantity: 1, price: 749 },
        ]),
        totalAmount: 4346,
        status: "pending",
        whatsappSent: false,
        createdAt: new Date(),
      },
    ];

    await db.order.createMany({ data: sampleOrders });

    return NextResponse.json({
      message: "Database seeded successfully",
      products: products.count,
      orders: sampleOrders.length,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
