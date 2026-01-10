"use client";

import React, { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate?: string;
  priority?: string;
  projectId?: string;
  projectName?: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Change the URL if your API endpoint is different
    fetch("http://localhost:3000/tasks")
      .then((res) => res.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task.id} className="border p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{task.title}</span>
              <span className="text-xs px-2 py-1 rounded bg-gray-200">{task.status}</span>
            </div>
            <div className="text-gray-600">{task.description}</div>
            {task.dueDate && (
              <div className="text-sm text-gray-400">Due: {task.dueDate}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}