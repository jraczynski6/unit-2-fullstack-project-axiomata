export default function Breadcrumbs({ crumbs }) {
  return (
    <nav>
      {crumbs?.join(" > ") || "Home"}
    </nav>
  );
}