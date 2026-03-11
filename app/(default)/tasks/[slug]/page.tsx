import Link from "next/link";
import { notFound } from "next/navigation";

import TaskDetail from "@/components/tasks/task-detail";
import { getTaskDirection, getTasksByDirection } from "@/lib/tasks";

type TaskParams = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: TaskParams }) {
  const { slug } = await params;
  const direction = getTaskDirection(slug);

  if (!direction) return {};

  return {
    title: `${direction.name}: практические задачи | PreOffer`,
    description: direction.description,
  };
}

export default async function TaskDirectionPage({ params }: { params: TaskParams }) {
  const { slug } = await params;
  const direction = getTaskDirection(slug);

  if (!direction) {
    notFound();
  }

  const tasks = await getTasksByDirection(slug);
  const companies = new Set(
    tasks.map((task) => task.company_name?.trim()).filter(Boolean),
  ).size;

  return (
    <section className="pb-20 pt-8 md:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <Link href="/tasks" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                <span aria-hidden>←</span> Назад к направлениям
              </Link>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Практика</p>
              <h1 className="text-4xl font-bold text-gray-900 md:text-5xl">{direction.name}</h1>
              <p className="text-lg text-gray-700">{direction.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-900 p-6 text-gray-100 shadow-lg">
              <div>
                <p className="text-sm text-gray-400">Задач</p>
                <p className="text-3xl font-semibold">{tasks.length.toLocaleString("ru-RU")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Компаний</p>
                <p className="text-3xl font-semibold">{companies.toLocaleString("ru-RU")}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Обновление</p>
                <p className="text-lg font-semibold text-emerald-300">Синхронизировано</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Фокус</p>
                <p className="text-lg font-semibold">Практика × компании</p>
              </div>
            </div>
          </div>
        </div>

        <TaskDetail tasks={tasks} />
      </div>
    </section>
  );
}
