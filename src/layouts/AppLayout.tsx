import * as React from "react";
import Footer from "../components/Shared/Footer";
import Navbar from "../components/App/AppNavbar";

export default function AppLayout({ children }: any) {
  return (
    <>
      <Navbar />
      <div className="p-6 h-[calc(100vh-132px)] overflow-y-scroll w-full container mx-auto">
        {children}
      </div>
      <Footer />
    </>
  );
}
