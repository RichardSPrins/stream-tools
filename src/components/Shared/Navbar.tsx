import Link from "next/link";
import * as React from "react";
import { signIn } from "next-auth/react";
import { Button } from "@mantine/core";

const LINKS: { name: string; path: string }[] = [
  {
    name: "How It Works",
    path: "/#how-it-works",
  },
  {
    name: "Features",
    path: "#",
  },
  // {
  //   name: "Pricing",
  //   path: "#",
  // },
  {
    name: "FAQs",
    path: "/#faq",
  },
];

export default function Navbar() {
  return (
    <>
      <div className="w-screen h-20 px-auto px-4 md:px-20 bg-black">
        <div className="flex justify-between items-center h-full">
          <div className="text-2xl font-bold">Stream Tools</div>
          <div className="flex gap-4">
            {LINKS.map((link) => (
              <a href={link.path}>{link.name}</a>
            ))}
          </div>
          <div className="flex gap-4">
            <Button variant="filled" color="brand.4" onClick={() => signIn()}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
