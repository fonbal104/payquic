import { Link } from 'react-router-dom';

// Shown instead of React Router's raw error screen.
export default function RouteError() {
  return (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="text-3xl font-bold text-brand-dark">Something went wrong</h1>
      <p className="mt-4">The page could not be displayed.</p>
      <Link to="/" className="mt-8 inline-block font-semibold text-brand-secondary underline">Home</Link>
    </div>
  );
}
