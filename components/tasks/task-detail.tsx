"use client";

import { Input, Select } from "antd";
import { useMemo, useState } from "react";

import type { TaskRow } from "@/lib/tasks";

type TaskDetailProps = {
  tasks: TaskRow[];
};

export default function TaskDetail({ tasks }: TaskDetailProps) {
  const [search, setSearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const companyOptions = useMemo(() => {
    const companies = Array.from(
      new Set(tasks.map((task) => task.company_name?.trim()).filter(Boolean)),
    ) as string[];

    return companies.sort((a, b) => a.localeCompare(b, "ru"));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const term = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const byCompany = selectedCompany
        ? (task.company_name ?? "").toLowerCase() === selectedCompany.toLowerCase()
        : true;

      if (!byCompany) {
        return false;
      }

      if (!term) {
        return true;
      }

      return task.task_text.toLowerCase().includes(term);
    });
  }, [search, selectedCompany, tasks]);

  return (
    <div className="mt-10 space-y-6">
      <div className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:grid-cols-[1fr_280px]">
        <Input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full !rounded-xl"
          placeholder="Поиск по тексту задачи"
          prefix={<span className="text-gray-400">🔍</span>}
          allowClear
        />
        <Select
          value={selectedCompany}
          onChange={(value) => setSelectedCompany(value)}
          className="w-full"
          placeholder="Компания"
          allowClear
          options={companyOptions.map((company) => ({ label: company, value: company }))}
        />
      </div>

      {filteredTasks.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white/70 px-5 py-6 text-center text-sm text-gray-600">
          По вашему запросу задач не найдено.
        </p>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task, index) => (
            <article
              key={task.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-600">
                  Задача #{index + 1}
                </span>
                {task.company_name && (
                  <span className="rounded-full bg-gray-100 px-2 py-1 font-medium text-gray-700">
                    {task.company_name}
                  </span>
                )}
              </div>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                {task.task_text}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
