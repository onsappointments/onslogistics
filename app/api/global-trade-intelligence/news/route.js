
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import News from "@/models/News";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_CATEGORIES = [
  "customs-compliance",
  "freight-market",
  "trade-routes",
  "ports-logistics",
  "global-trade",
];

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const requestedPage = Number.parseInt(
      searchParams.get("page") || "1",
      10
    );

    const requestedLimit = Number.parseInt(
      searchParams.get("limit") || "20",
      10
    );

    const page = Number.isFinite(requestedPage)
      ? Math.max(1, requestedPage)
      : 1;

    const limit = Number.isFinite(requestedLimit)
      ? Math.min(50, Math.max(1, requestedLimit))
      : 20;

    const category = searchParams.get("category") || "all";

    const search = (searchParams.get("q") || "")
      .trim()
      .slice(0, 100);

    const filter = {
      status: "published",
    };

    // Category filter
    if (category !== "all") {
      if (!ALLOWED_CATEGORIES.includes(category)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid category.",
          },
          { status: 400 }
        );
      }

      filter.category = category;
    }

    // Search only the article title for now.
    if (search) {
      filter.title = {
        $regex: escapeRegex(search),
        $options: "i",
      };
    }

    const [articles, total] = await Promise.all([
      News.find(filter)
        .select(
          "title slug url source sourceDomain category publishedAt imageUrl language sourceCountry"
        )
        .sort({
          publishedAt: -1,
          _id: -1,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      News.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        articles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[Trade News] Public API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve trade news.",
      },
      { status: 500 }
    );
  }
}
