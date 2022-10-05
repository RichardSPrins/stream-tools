import Link from "next/link";

export default function Footer() {
  return (
    <footer className="p-4 shadow md:flex md:items-center md:justify-between md:p-6 bg-black border-t border-gray-600">
      <span className="text-sm text-white sm:text-center">
        © {new Date().getFullYear()}{" "}
        <a href="https://flowbite.com/" className="hover:underline">
          Extensibl Media
        </a>
        . All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm text-white sm:mt-0">
        <li>
          <a href="#" className="mr-4 hover:underline md:mr-6 ">
            About
          </a>
        </li>
        {/* <li>
          <a href="#" className="mr-4 hover:underline md:mr-6">
            Privacy Policy
          </a>
        </li>
        <li>
          <a href="#" className="mr-4 hover:underline md:mr-6">
            Licensing
          </a>
        </li> */}
        <li>
          <Link href="/roadmap" className="hover:underline">
            Roadmap
          </Link>
        </li>
      </ul>
    </footer>
  );
}
