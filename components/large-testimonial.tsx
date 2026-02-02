"use client";

import { useRef } from "react";
import Image from "next/image";
import { Carousel } from "antd";
import TestimonialImg from "@/public/images/large-testimonial.jpg";

const testimonials = [
  {
    quote:
      "После четырёх собеседований без оффера я понял, что готовился не к тому. PreOffer показал реальные вопросы, критерии «норма / провал» и типовые ошибки — стало ясно, куда копать и как отвечать уверенно.",
    name: "Даниил, Junior Frontend",
    result: "первый оффер после 2 дополнительных раундов",
  },
  {
    quote:
      "Список реальных вопросов и фильтры по стеку спасли недели подготовки. Я убрал лишнее, сфокусировался на том, что спрашивали у junior-ов, и ответы стали точнее.",
    name: "Мария, Junior QA",
    result: "оффер в финале без доп. тестового",
  },
  {
    quote:
      "Больше всего помогли пояснения «зачем задают» и примеры провалов. Теперь понимаю, что хотят услышать, и не теряюсь на базовых вопросах.",
    name: "Илья, Junior Backend",
    result: "оффер после 5 интервью",
  },
  {
    quote:
      "PreOffer показал, какие темы реально решают исход собеседования. Ушёл страх, потому что было понятно, что учить и как отвечать.",
    name: "Анастасия, Junior Data Analyst",
    result: "первый оффер за 3 недели",
  },
];

export default function LargeTestimonial() {
  const carouselRef = useRef<any>(null);

  return (
    <section>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="py-10 md:py-16">
          <div className="relative space-y-6 text-center">
            <div className="relative inline-flex">
              <svg
                className="absolute -left-6 -top-2 -z-10"
                width={40}
                height={49}
                viewBox="0 0 40 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.7976 -0.000136375L39.9352 23.4746L33.4178 31.7234L13.7686 11.4275L22.7976 -0.000136375ZM9.34947 17.0206L26.4871 40.4953L19.9697 48.7441L0.320491 28.4482L9.34947 17.0206Z"
                  fill="#D1D5DB"
                />
              </svg>
              <Image
                className="rounded-full"
                src={TestimonialImg}
                width={48}
                height={48}
                alt="Large testimonial"
              />
            </div>
            <Carousel
              ref={carouselRef}
              autoplay
              autoplaySpeed={5500}
              dots
              pauseOnHover
              className="px-8"
            >
              {testimonials.map((item) => (
                <div key={item.name}>
                  <div className="space-y-3">
                    <p className="text-xl font-semibold leading-relaxed text-gray-900">
                      “{item.quote}”
                    </p>
                    <div className="text-[13px] font-medium text-gray-500">
                      <span className="text-gray-700">{item.name}</span>{" "}
                      <span className="text-gray-400">/</span>{" "}
                      <span className="text-blue-500">{item.result}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Carousel>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => carouselRef.current?.prev()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
                aria-label="Предыдущий отзыв"
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5 3.5L6 8l4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => carouselRef.current?.next()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
                aria-label="Следующий отзыв"
              >
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 3.5L10 8l-4.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
