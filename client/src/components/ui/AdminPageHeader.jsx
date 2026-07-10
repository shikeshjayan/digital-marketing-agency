export default function AdminPageHeader({ title, subtitle }) {
  return (
    <div>
      <h2 className="subheading text-heading">{title}</h2>
      {subtitle && (
        <p className="mt-1 small-text text-text">{subtitle}</p>
      )}
    </div>
  );
}
