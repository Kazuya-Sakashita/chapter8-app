"use client";
import Link from "next/link";

const Navbar: React.FC = function Navbar() {
  return (
    <nav className="bg-gray-800 text-white w-full">
      <div className="container mx-auto flex justify-between items-center p-6">
        <Link href="/" className="text-base font-bold">
          Blog
        </Link>
        <ul>
          <li>
            <Link href="/contact" className="text-base font-bold">
              お問い合わせ
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
