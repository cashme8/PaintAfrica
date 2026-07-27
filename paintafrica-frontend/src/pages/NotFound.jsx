import { Link } from "react-router-dom";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="job-number text-sm text-ink-600">Error 404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-carbon-900">Page not found</h1>
      <p className="mt-2 text-sm text-carbon-500">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
}
