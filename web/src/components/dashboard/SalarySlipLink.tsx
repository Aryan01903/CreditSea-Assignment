export function SalarySlipLink({ url }: { url?: string | null }) {
  if (!url) return <span className="text-gray-400">—</span>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-brand-600 hover:text-brand-700"
    >
      View slip
    </a>
  );
}
