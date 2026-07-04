export default function AdminPageHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
      )}
    </div>
  );
}
