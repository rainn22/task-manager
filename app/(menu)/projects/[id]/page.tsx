import Link from "next/link";
import { getProjects } from "@/lib/api/project";
import { getTasks } from "@/lib/api/task";
import TaskCard from "@/components/project/task";
import MiniDashboard from "@/components/project/miniDashboard";
import Member from "@/components/project/member";
import { getMembers } from "@/lib/api/member";
import type { Member as MemberType } from "@/validations/member";
import { notFound } from "next/navigation";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const projects = await getProjects();
  const tasks = await getTasks();
  const allMembers = await getMembers();

  const project = projects.find((p) => p.id === id);
  if (!project) return notFound();

  const projectTasks = tasks.filter(
    (task) => task.projectId === project.id
  );

  const totalTasks = projectTasks.length;
  const completed = projectTasks.filter(t => t.status === "done").length;
  const inProgress = projectTasks.filter(t => t.status === "in-progress").length;
  const todo = projectTasks.filter(t => t.status === "todo").length;
  const members = allMembers.filter(member => project.members && project.members.includes(member.id));

  return (
    <div className="p-6 space-y-8">

      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/projects" className="hover:underline">
          Projects
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-900">
          {project.name}
        </span>
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
              isCompleted={task.status === "done"}
              comments={task.comments || []}
            />
          ))
        )}
      </div>
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Team Members
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          {members.map((member: MemberType) => (
            <Member
              key={member.name}
              name={member.name}
              position={member.position || ""}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
