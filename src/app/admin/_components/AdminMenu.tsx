import Link from "next/link";

type MenuItem = {
  href: string;
  label: string;
};

type AdminMenuProps = {
  items: MenuItem[];
  currentPath: string | null;
};

const AdminMenu: React.FC<AdminMenuProps> = ({ items, currentPath }) => {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`block p-2 rounded ${
              currentPath?.startsWith(item.href) ? "bg-blue-100" : ""
            }`}
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default AdminMenu;
