'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createProject = useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: { 'Content-Type': 'application/json' },
      });
      return res.json();
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      router.push(`/projects/${project.id}`);
    },
  });

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-semibold mb-4">New Project</h1>

      <button
        onClick={() => createProject.mutate('New Project')}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Create
      </button>
    </div>
  );
}
