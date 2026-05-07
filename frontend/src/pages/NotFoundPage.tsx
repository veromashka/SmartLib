import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { EmptyState } from '@/shared/ui/EmptyState';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or has been moved."
        action={
          <Link to="/books">
            <Button>Back to library</Button>
          </Link>
        }
      />
    </div>
  );
}
