import { usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getTasks } from '@/lib/api/task';
import { getProjects } from '@/lib/api/project';

export function useHeaderMeta() {
  const pathname = usePathname();

  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });

  const taskCount = tasks?.length ?? 0;
  const projectCount = projects?.length ?? 0;

  if (pathname === '/dashboard') {
    return {
      title: 'Dashboard',
      subtitle: 'Welcome back, Lika!',
    };
  }

  if (pathname === '/tasks') {
    return {
      title: 'Tasks',
      subtitle: `${taskCount} total tasks`,
    };
  }

  if (pathname === '/projects') {
    return {
      title: 'Projects',
      subtitle: `${projectCount} active projects`,
    };
  }

  if (pathname.startsWith('/tasks/') && pathname !== '/tasks/new') {
    return {
      title: 'Task',
      subtitle: 'Task details',
    };
  }

  return { title: '', subtitle: '' };
}
