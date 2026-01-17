import { Badge } from "@/components/ui/badge";
import { statusBadgeClasses, statusLabels } from "@/lib/utils";
import { Task } from "@/validations/task";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit } from "lucide-react";

export default function TaskHeader({ task }: { task: Task }) {
  return (
    <section className="bg-white rounded-xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{task.title}</h1>
          <Badge className={`rounded-sm ${statusBadgeClasses[task.status]}`}>
            {statusLabels[task.status]}
          </Badge>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/tasks/${task.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </div>
      <h4 className="font-medium">Description</h4>
      <p className="text-muted-foreground">{task.description}</p>
    </section>
  );
}
