// Components/locations/LocationArticles.jsx

import Link from "next/link";
import Image from "next/image";

import {
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function LocationArticles({ data }) {
  return (
    <section className="bg-white py-24 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">

          <div>

            {/* TAG */}
            <div className="inline-flex items-center gap-2 text-blue-600 mb-4">

              <BookOpen className="w-5 h-5" />

              Logistics Knowledge Hub

            </div>

            {/* TITLE */}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">

              Related Logistics Resources

            </h2>

            {/* SUBTEXT */}
            <p className="mt-6 text-lg text-slate-600 max-w-3xl leading-relaxed">

              Explore shipping guides, export resources, freight insights,
              customs knowledge, and logistics articles relevant to businesses
              in {data.city} and across India.

            </p>

          </div>

          {/* BUTTON */}
          <Link
            href="/resources"
            className="
              inline-flex
              items-center
              gap-2
              text-blue-600
              font-semibold
              hover:text-blue-700
              transition-colors
            "
          >

            View All Resources

            <ArrowRight className="w-5 h-5" />

          </Link>

        </div>


        {/* ARTICLES GRID */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {data.relatedArticles.map((article) => (

            <Link
              key={article.slug}
              href={`/resources/${article.slug}`}
              className="
                group
                rounded-[2rem]
                border
                border-slate-200
                bg-[#F8FAFC]
                overflow-hidden
                hover:shadow-2xl
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >

              {/* CONTENT */}
              <div className="p-8">

                {/* CATEGORY */}
                <div className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-blue-50
                  text-blue-600
                  px-4
                  py-2
                  text-sm
                  font-medium
                  mb-6
                ">

                  Logistics Guide

                </div>

                {/* TITLE */}
                <h3 className="
                  text-2xl
                  font-semibold
                  text-slate-900
                  leading-snug
                  mb-5
                  group-hover:text-blue-700
                  transition-colors
                ">

                  {article.title}

                </h3>

                {/* DESCRIPTION */}
                <p className="
                  text-slate-600
                  leading-relaxed
                  mb-8
                ">

                  {article.description}

                </p>

                {/* READ MORE */}
                <div className="
                  inline-flex
                  items-center
                  gap-2
                  text-blue-600
                  font-semibold
                ">

                  Read Article

                  <ArrowRight className="
                    w-4
                    h-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  " />

                </div>

              </div>

            </Link>

          ))}

        </div>

      </div>

    </section>
  );
}