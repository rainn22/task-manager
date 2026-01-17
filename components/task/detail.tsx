import { Label } from "@/components/ui/label";
import Member from "@/components/project/member";
import { Task } from "@/validations/task";
import { Member as MemberSchema } from "@/validations/member";
import { Project } from "@/validations/project";
import { Button } from "../ui/button";
import { Plus, Calendar, Paperclip, Flag } from "lucide-react";
import formatDate, { priorityColors, statusBadgeClasses } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function TaskDetails({
  task,
  members,
  project,
}: {
  task: Task;
  members: MemberSchema[];
  project?: Project;
}) {
  const assignees = members.filter((m) => task.assignees?.includes(m.id));
  const attachments = task.attachments ?? [];

  return (
    <section className="bg-white rounded-xl p-6 space-y-5">
      <h3 className="text-lg font-semibold">Task Details</h3>
      <div className="space-y-6">
        <div className="space-y-2.5">
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Status
          </Label>
          <Select defaultValue={task.status}>
            <SelectTrigger className={cn("w-full", statusBadgeClasses[task.status])}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {task.priority && (
          <div className="space-y-2.5">
            <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
              <Flag className="h-3.5 w-3.5" />
              Priority
            </Label>
            <div
              className={`w-full flex items-center px-3.5 py-2 rounded-lg border text-sm font-medium capitalize ${
                priorityColors[task.priority.toLowerCase()] ??
                "bg-gray-50 text-gray-600 border-gray-200"
              }`}
            >
              {task.priority}
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Assignees
          </Label>
          {assignees.length === 0 ? (
            <div className="w-full px-3.5 py-3 rounded-lg border border-dashed border-gray-200 bg-gray-50/50">
              <span className="text-sm text-gray-500">No assignees yet</span>
            </div>
          ) : (
            <div className="space-y-2">
              {assignees.map((member) => (
                <Member key={member.id} name={member.name} />
              ))}
            </div>
          )}
        </div>

        {task.dueDate && (
          <div className="space-y-2.5">
            <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Due Date
            </Label>
            <div className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                {formatDate(task.dueDate)}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2.5">
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Project
          </Label>
          <div className="w-full flex items-center gap-3 px-3.5 py-3 rounded-lg border border-gray-200">
            <span
              className={`h-3 w-3 rounded-full ring-2 ring-white shadow-sm ${
                project?.color ?? "bg-gray-300"
              }`}
            />
            <span className="text-sm font-medium text-gray-700">
              {project?.name ?? "Unknown project"}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <Label className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center gap-1.5">
            <Paperclip className="h-3.5 w-3.5" />
            Attachments
          </Label>
          {attachments.length === 0 ? (
            <div className="w-full px-3.5 py-3 rounded-lg border border-dashed border-gray-200 bg-gray-50/50">
              <span className="text-sm text-gray-500">No attachments</span>
            </div>
          ) : (
            <div className="space-y-2">
              {attachments.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 px-3.5 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                >
                  <Paperclip className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-700">{file.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2 border border-dashed border-gray-300 rounded-lg"
        >
          <Plus className="h-4 w-4" />
          Add attachment
        </Button>
      </div>
    </section>
  );
}
