import { Badge } from '../ui/badge';
import { Card } from '../ui/card';

export function StatCard({ title, value, change, icon }: any) {
  return (
    <Card className="rounded-lg shadow p-6 flex flex-col gap-2 bg-white dark:bg-zinc-900">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">{title}</span>
        {icon}
      </div>
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-green-500 text-sm">{change} from last week</span>
    </Card>
  );
}

export function DueBadge({ due }: { due: string }) {
  let color = 'bg-zinc-200 text-zinc-700';
  if (due === 'Today') color = 'bg-red-100 text-red-700';
  if (due === 'Tomorrow') color = 'bg-yellow-100 text-yellow-700';
  if (due === 'Jan 10') color = 'bg-blue-100 text-blue-700';
  return <Badge className={`text-xs ${color}`}>{due}</Badge>;
}
