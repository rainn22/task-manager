import { Badge } from "@/components/ui/badge";
import { statusBadgeClasses, statusLabels } from "@/lib/utils";
import { Task } from "@/validations/task";

export default function TaskHeader({ task }: { task: Task }) {
  return (
    <section className="bg-white rounded-xl p-6 space-y-3">
      <div>
        <h1 className="text-2xl font-semibold">{task.title}</h1>
        <Badge className={`rounded-sm ${statusBadgeClasses[task.status]}`}>
          {statusLabels[task.status]}
        </Badge>
      </div>
      <h4 className="font-medium">Description</h4>
      <p className="text-muted-foreground">{task.description}</p>
    </section>
  );
}
