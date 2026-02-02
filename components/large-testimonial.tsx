import Image from "next/image";
import TestimonialImg from "@/public/images/large-testimonial.jpg";
import { Carousel } from "antd";

export default function LargeTestimonial() {
  const testimonials = [
    {
      quote:
        "После четырёх собеседований без оффера я понял, что готовился не к тому. PreOffer показал реальные вопросы, критерии «норма / провал» и типовые ошибки — стало ясно, куда копать и как отвечать уверенно.",
      name: "Даниил, Junior Frontend",
      outcome: "первый оффер после 2 дополнительных раундов",
    },
    {
      quote:
        "Думала, что знаю теорию, но на собесах спрашивали другое. В PreOffer сразу увидела, какие темы реально проверяют и какие ответы считаются нормой.",
      name: "Алина, Junior QA",
      outcome: "офер в продуктовую команду за 3 недели",
    },
    {
      quote:
        "Понял, что заваливал ответы на алгоритмах и базовых вопросах по стеку. Список типовых ошибок помог не повторять их на следующих интервью.",
      name: "Илья, Junior Backend",
      outcome: "закрыл стажировку в финтехе",
    },
    {
      quote:
        "Наконец-то появилось ощущение, что готовлюсь по делу. Фильтры по темам и компаниям сэкономили недели хаотичного чтения.",
      name: "София, Junior Data Analyst",
      outcome: "прошла два технических раунда подряд",
    },
  ];

  return (
    <section>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div className="py-10 md:py-16">
          <Carousel
            autoplay
            autoplaySpeed={6500}
            dots
            arrows
            draggable
            pauseOnHover
            className="w-full"
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="px-2">
                <div className="space-y-2 text-center">
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
                  <p className="text-xl font-semibold leading-relaxed text-gray-900">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-[13px] font-medium text-gray-500">
                    <span className="text-gray-700">{testimonial.name}</span>{" "}
                    <span className="text-gray-400">/</span>{" "}
                    <a className="text-blue-500" href="#0">
                      {testimonial.outcome}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
