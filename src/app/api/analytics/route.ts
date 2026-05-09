import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Total stats
    const totalProducts = await db.product.count();
    const totalOrders = await db.order.count();
    const totalRevenue = await db.order.aggregate({
      _sum: { totalAmount: true },
    });
    const lowStock = await db.product.count({
      where: { stock: { lt: 10 } },
    });

    // Sales by month (last 6 months)
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const orders = await db.order.findMany({
      where: { createdAt: { gte: sixMonthsAgo } },
      orderBy: { createdAt: "asc" },
    });

    const salesByMonth: Record<string, number> = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      salesByMonth[key] = 0;
    }

    orders.forEach((order) => {
      const d = order.createdAt;
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      if (salesByMonth[key] !== undefined) {
        salesByMonth[key] += order.totalAmount;
      }
    });

    // Category distribution
    const products = await db.product.findMany();
    const categoryMap: Record<string, number> = {};
    products.forEach((p) => {
      categoryMap[p.category] = (categoryMap[p.category] || 0) + 1;
    });

    // Order status distribution
    const allOrders = await db.order.findMany();
    const statusMap: Record<string, number> = {};
    allOrders.forEach((o) => {
      statusMap[o.status] = (statusMap[o.status] || 0) + 1;
    });

    // Top selling products (from order items)
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    allOrders.forEach((order) => {
      try {
        const items = JSON.parse(order.items) as Array<{
          name: string;
          quantity: number;
          price: number;
        }>;
        items.forEach((item) => {
          if (!productSales[item.name]) {
            productSales[item.name] = {
              name: item.name,
              quantity: 0,
              revenue: 0,
            };
          }
          productSales[item.name].quantity += item.quantity;
          productSales[item.name].revenue += item.price * item.quantity;
        });
      } catch {
        // skip invalid JSON
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Recent orders
    const recentOrders = await db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      lowStock,
      salesByMonth,
      categoryDistribution: categoryMap,
      orderStatusDistribution: statusMap,
      topProducts,
      recentOrders,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
