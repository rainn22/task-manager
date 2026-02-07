import { MessageSquare } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Member from '@/components/project/member';
import { Comment } from '@/validations/task';
import formatDate from '@/lib/utils';

export default function TaskComments({ comments }: { comments: Comment[] }) {
  return (
    <section className="bg-white rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Comments ({comments.length})</h3>
      </div>

      {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet</p>}

      {comments.map((comment) => (
        <Member
          key={comment.id}
          name={comment.author}
          meta={formatDate(comment.createdAt)}
          secondaryText={comment.content}
        />
      ))}

      <Textarea placeholder="Write a comment..." className="resize-none" />
      <Button className="w-fit">Post Comment</Button>
    </section>
  );
}
