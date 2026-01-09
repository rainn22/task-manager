import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Subtask } from "@/validations/task";

export default function TaskSubtasks({ subtasks }: { subtasks: Subtask[] }) {
  const completed = subtasks.filter((s) => s.completed).length;

  return (
    <section className="bg-white rounded-xl p-6 space-y-4">
      <div className="flex-row items-center justify-between">
        <h3 className="text-lg font-semibold">Subtasks</h3>
        <span className="text-sm text-muted-foreground">
          {completed} of {subtasks.length} completed
        </span>
      </div>

      {subtasks.length === 0 && (
        <p className="text-sm text-muted-foreground">No subtasks</p>
      )}

      {subtasks.map((subtask) => (
        <div key={subtask.id} className="flex items-center gap-3">
          <Checkbox checked={subtask.completed} />
          <span
            className={
              subtask.completed ? "line-through text-muted-foreground" : ""
            }
          >
            {subtask.title}
          </span>
        </div>
      ))}

      <div className="pt-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-dashed border-gray-300 hover:border-gray-400 rounded-lg transition-all"
        >
          <Plus className="h-4 w-4" />
          Add Subtask
        </Button>
      </div>
    </section>
  );
}
