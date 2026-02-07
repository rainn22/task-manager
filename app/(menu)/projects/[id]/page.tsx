'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

import { getProjectById } from '@/lib/api/project';
import { getTasksByProjectId } from '@/lib/api/task';
import { getMembersByIds } from '@/lib/api/member';

import TaskCard from '@/components/project/task';
import MiniDashboard from '@/components/project/miniDashboard';
import Member from '@/components/project/member';

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: project,
    isLoading: projectLoading,
    isError: projectError,
  } = useQuery({
    queryKey: ['project', id],
    queryFn: () => getProjectById(id),
    enabled: !!id,
  });

  const { data: projectTasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks', project?.id],
    queryFn: () => getTasksByProjectId(project!.id),
    enabled: !!project?.id,
  });

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ['project-members', project?.id],
    queryFn: () => getMembersByIds(project!.members || []),
    enabled: !!project?.members?.length,
  });

  if (projectLoading || tasksLoading || membersLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  if (projectError || !project) {
    return <p className="p-6 text-red-500">Project not found</p>;
  }

  const totalTasks = projectTasks.length;
  const completed = projectTasks.filter((t) => t.status === 'done').length;
  const inProgress = projectTasks.filter((t) => t.status === 'in-progress').length;
  const todo = projectTasks.filter((t) => t.status === 'todo').length;

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/projects" className="hover:underline">
          Projects
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900">{project.name}</span>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <p className="text-gray-600">{project.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <MiniDashboard Name="Total Tasks" Total={totalTasks} />
        <MiniDashboard Name="Completed" Total={completed} />
        <MiniDashboard Name="In Progress" Total={inProgress} />
        <MiniDashboard Name="To Do" Total={todo} />
      </div>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Tasks</h2>

        {projectTasks.length === 0 ? (
          <p className="text-gray-500">No tasks for this project</p>
        ) : (
          projectTasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              status={task.status}
              isCompleted={task.status === 'done'}
              comments={task.comments || []}
            />
          ))
        )}
      </div>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Team Members</h2>

        <div className="grid gap-3 md:grid-cols-2">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-4 p-4 border rounded-md">
              <Member name={member.name} secondaryText={member.position || ''} />
            </div>
          ))}

          {members.length === 0 && <p className="text-sm text-gray-400">No members assigned</p>}
        </div>
      </div>
    </div>
  );
}
