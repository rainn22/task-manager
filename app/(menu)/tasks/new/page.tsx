"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/validations/project";
import { getProjects } from "@/lib/api/project";
import { useQuery } from "@tanstack/react-query";

export default function AddTask() {
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  return (
    <div className="md:px-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold">Create New Task</h1>
        <p className="text-slate-600">
          Fill in the details below to add a new task to your project
        </p>
      </div>
      <div className="bg-white rounded-xl p-6 space-y-5">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">
                Title <span className="text-red-500">*</span>
              </FieldLabel>
              <Input id="title" placeholder="Task title" />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">
                Description <span className="text-red-500">*</span>
              </FieldLabel>
              <Textarea
                id="description"
                placeholder="Task description"
                rows={4}
              />
            </Field>
            <div className="grid md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>
                  Project <span className="text-red-500">*</span>
                </FieldLabel>

                <Select disabled={isLoading || isError}>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoading
                          ? "Loading projects..."
                          : isError
                          ? "Failed to load projects"
                          : "Select project"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {projects?.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isError && (
                  <FieldDescription className="text-red-500">
                    Failed to load projects
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <FieldLabel>Priority</FieldLabel>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low" className="rounded-lg">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        Low
                      </span>
                    </SelectItem>
                    <SelectItem value="medium" className="rounded-lg">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Medium
                      </span>
                    </SelectItem>
                    <SelectItem value="high" className="rounded-lg">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        High
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Field>
                <FieldLabel>
                  Status <span className="text-red-500">*</span>
                </FieldLabel>
                <Select defaultValue="todo">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo" className="rounded-lg">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        Todo
                      </span>
                    </SelectItem>
                    <SelectItem value="in-progress" className="rounded-lg">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-yellow-500" />
                        In Progress
                      </span>
                    </SelectItem>
                    <SelectItem value="done" className="rounded-lg">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Done
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
                <Input id="dueDate" type="date" />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline">Cancel</Button>
          <Button>Create Task</Button>
        </div>
      </div>
    </div>
  );
}
