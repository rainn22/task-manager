import { TaskStatus } from '@/validations/task';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import Link from 'next/link';

export default function TaskRow({
  id,
  checked,
  onCheckedChange,
  title,
  description,
  status,
  project,
  comments,
  attachments,
  flagged,
  due,
  initialsList,
  maxInitials,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: () => void;
  title: string;
  description?: string;
  status: TaskStatus;
  project: string;
  comments: number;
  attachments: number;
  flagged: boolean;
  due: string;
  initialsList: string[];
  maxInitials: number;
}) {
  const shown = initialsList.slice(0, maxInitials);
  const remaining = Math.max(0, initialsList.length - shown.length);

  return (
    <li className="flex items-center justify-between py-4 border-b last:border-b-0">
      <div className="flex items-center gap-3 w-1/2 min-w-0">
        <Input
          type="checkbox"
          checked={checked}
          onChange={onCheckedChange}
          className="accent-black w-4 h-4"
        />
        <div className="min-w-0">
          <span
            className={`font-medium text-base ${
              checked ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'
            }`}
          >
            <Link href={`/tasks/${id}`}>{title}</Link>
          </span>
          {description ? (
            <span className="block text-xs text-zinc-400 truncate">{description}</span>
          ) : null}
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center gap-2 w-1/2 justify-end">
        <ProjectBadge project={project} />
        <IconBadge label="💬" value={comments} />
        <IconBadge label="📎" value={attachments} />
        {flagged && <IconBadge label="🚩" />}
        {due && <IconBadge label="📅" value={due} />}
        <div className="flex items-center gap-1 ml-2">
          {shown.map((ini, idx) => (
            <AssigneeCircle key={`${id}-${ini}-${idx}`} text={ini} />
          ))}
          {remaining > 0 ? (
            <span className="h-7 px-2 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold flex items-center">
              +{remaining}
            </span>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function StatusBadge({ status }: { status: TaskStatus }) {
  if (status === 'done') {
    return <Badge className="ml-2 bg-green-100 text-green-700 border-green-200">Done</Badge>;
  }
  if (status === 'in-progress') {
    return (
      <Badge className="ml-2 bg-orange-100 text-orange-700 border-orange-200">In Progress</Badge>
    );
  }
  return (
    <Badge variant="secondary" className="ml-2">
      To Do
    </Badge>
  );
}

function ProjectBadge({ project }: { project: string }) {
  return (
    <Badge variant="outline" className="px-2 py-1">
      {project}
    </Badge>
  );
}

function IconBadge({ label, value }: { label: string; value?: string | number }) {
  return (
    <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1">
      <span>{label}</span>
      {value !== undefined && <span>{value}</span>}
    </Badge>
  );
}

function AssigneeCircle({ text }: { text: string }) {
  return (
    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-violet-500 text-white text-[10px] font-bold">
      {text}
    </span>
  );
}
