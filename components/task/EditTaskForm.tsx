"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Project } from "@/validations/project";
import { patchTask } from "@/lib/api/task";
import { CreateTask, CreateTaskSchema } from "@/validations/task";
import { Member } from "@/validations/member";

interface EditTaskFormProps {
  id: string;
  task: any; // Define proper type if available
  projects: Project[];
  members: Member[];
}

export default function EditTaskForm({ id, task, projects, members }: EditTaskFormProps) {
  const router = useRouter();

  const { control, handleSubmit, reset, formState: { dirtyFields } } = useForm<CreateTask>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      projectId: "",
      priority: "medium",
      dueDate: "",
      assignees: [],
      attachments: [],
    },
  });


  React.useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        status: task.status,
        projectId: task.projectId,
        priority: task.priority,
        dueDate: task.dueDate,
        assignees: task.assignees || [],
        attachments: task.attachments || [],
      });
    }
  }, [task, reset]);

  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = React.useState(false);
  const [pendingData, setPendingData] = React.useState<Partial<CreateTask> | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Partial<CreateTask>) => patchTask(id, data),
    onSuccess: () => {
      setShowSuccessDialog(true);
      setTimeout(() => {
        router.push(`/tasks/${id}`);
      }, 2000);
    },
  });

  function onSubmit(data: CreateTask) {

    const changedData: Partial<CreateTask> = {};
    Object.keys(dirtyFields).forEach((key) => {
      if (dirtyFields[key as keyof typeof dirtyFields]) {
        (changedData as any)[key] = data[key as keyof CreateTask];
      }
    });
    if (Object.keys(changedData).length > 0) {
      setPendingData(changedData);
      setShowConfirmDialog(true);
    } else {
      router.push(`/tasks/${id}`);
    }
  }

  function handleConfirm() {
    if (pendingData) {
      mutate(pendingData);
      setShowConfirmDialog(false);
      setPendingData(null);
    }
  }

  return (
    <div className="md:px-6 space-y-6">
      <div>
        <h1 className="text-lg font-bold">Edit Task</h1>
        <p className="text-slate-600">
          Update the details below to modify the task
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
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects?.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
            </div>

            <Controller
              name="assignees"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="assignees">Assignees</FieldLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {members?.map((member) => (
                      <div key={member.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`assignee-${member.id}`}
                          checked={field.value?.includes(member.id) || false}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              field.onChange([...current, member.id]);
                            } else {
                              field.onChange(current.filter((id) => id !== member.id));
                            }
                          }}
                        />
                        <Label htmlFor={`assignee-${member.id}`} className="text-sm">
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
                      <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                        <span>{attachment.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const current = field.value || [];
                            field.onChange(current.filter((a) => a.id !== attachment.id));
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
              {isPending ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update this task?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              Task updated successfully!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}