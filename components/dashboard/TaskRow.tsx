import Link from "next/link";
import { DueBadge } from "./StatCard";
import { StatusBadge } from "./StatusBadge";

export function TaskRow({
  id,
  checked,
  title,
  project,
  status,
  due,
}: {
  id: string;
  checked: boolean;
  title: string;
  project: string;
  status: "done" | "in-progress" | "todo";
  due: string;
}) {
  return (
    <li className="flex items-center justify-between py-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="accent-black"
        />
        <div>
          <span
            className={`font-medium ${
              checked ? "line-through text-zinc-400" : ""
            }`}
          >
            <Link
              href={`/tasks/${id}`}
            >
              {title}
            </Link>
          </span>
          <span className="block text-xs text-zinc-400">{project}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        <DueBadge due={due} />
      </div>
    </li>
  );
}
