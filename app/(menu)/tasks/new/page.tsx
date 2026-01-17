"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
  FieldDescription,
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
import { createTask } from "@/lib/api/task";
import { CreateTask, CreateTaskSchema } from "@/validations/task";
import { Label } from "@/components/ui/label";
import { Member } from "@/validations/member";
import { getMembers } from "@/lib/api/member";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddTask() {
  const router = useRouter();

  const {
    data: projects,
    isLoading,
    isError,
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

  if (membersLoading) return <p>Loading...</p>;
  if (membersError)
    return <p className="text-red-500">Failed to load members</p>;

  const { control, handleSubmit } = useForm<CreateTask>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      projectId: "",
      priority: "medium",
      dueDate: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTask,
    onSuccess: () => router.push("/tasks"),
  });

  function onSubmit(data: CreateTask) {
    mutate(data);
  }

  return (
    <div className="md:px-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold">Create New Task</h1>
        <p className="text-slate-600">
          Fill in the details below to add a new task to your project
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">
                    Title <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} placeholder="Task title" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Task description"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Controller
                name="projectId"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="projectId">
                      Project <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select
                      disabled={isLoading}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
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
                )}
              />

              <Controller
                name="priority"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="priority">
                      Priority <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
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
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Controller
                name="status"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="status">
                      Status <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
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
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="dueDate"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="dueDate">
                      Due Date <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input type="date" {...field} />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="assignees"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="assignees">Assignees</FieldLabel>
                    <div className="grid grid-cols-2 gap-2">
                      {members?.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`assignee-${member.id}`}
                            checked={field.value?.includes(member.id) || false}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              if (checked) {
                                field.onChange([...current, member.id]);
                              } else {
                                field.onChange(
                                  current.filter((id) => id !== member.id),
                                );
                              }
                            }}
                          />
                          <Label
                            htmlFor={`assignee-${member.id}`}
                            className="text-sm"
                          >
                            {member.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="attachments"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="attachments">Attachments</FieldLabel>
                    <div className="space-y-2">
                      {field.value?.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <span>{attachment.name}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const current = field.value || [];
                              field.onChange(
                                current.filter((a) => a.id !== attachment.id),
                              );
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const newAttachments = files.map((file) => ({
                            id: Math.random().toString(36).substr(2, 9), // temp id
                            name: file.name,
                            type: file.type,
                          }));
                          const current = field.value || [];
                          field.onChange([...current, ...newAttachments]);
                        }}
                      />
                    </div>
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
