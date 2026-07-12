import Link from "next/link"

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  return (
    <nav className="text-sm text-muted-foreground mb-6">
      {items.map((item, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-2">/</span>}
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
