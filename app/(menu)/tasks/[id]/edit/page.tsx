"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Project } from "@/validations/project";
import { getProjects } from "@/lib/api/project";
import { getTaskById } from "@/lib/api/task";
import { getMembers } from "@/lib/api/member";
import { Member } from "@/validations/member";
import EditTaskForm from "@/components/task/EditTaskForm";

export default function EditTask() {
  const { id } = useParams<{ id: string }>();

  const {
    data: task,
    isLoading: taskLoading,
    isError: taskError,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTaskById(id),
    enabled: !!id,
  });

  const {
    data: projects,
    isLoading: projectsLoading,
    isError: projectsError,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
  } = useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: getMembers,
  });

  if (taskLoading || projectsLoading || membersLoading) return <p>Loading...</p>;
  if (taskError || !task) return <p className="text-red-500">Failed to load task</p>;
  if (projectsError) return <p className="text-red-500">Failed to load projects</p>;
  if (membersError) return <p className="text-red-500">Failed to load members</p>;

  return <EditTaskForm id={id} task={task} projects={projects!} members={members!} />;
}