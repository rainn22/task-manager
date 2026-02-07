import { Badge } from '../ui/badge';

export function StatusBadge({ status }: { status: string }) {
  if (status === 'done')
    return <Badge className="bg-green-100 text-green-700 border-green-200">Done</Badge>;
  if (status === 'in-progress')
    return <Badge className="bg-orange-100 text-orange-700 border-orange-200">In Progress</Badge>;
  return <Badge variant="secondary">To Do</Badge>;
}
