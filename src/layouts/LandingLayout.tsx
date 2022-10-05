import * as React from "react";
import Footer from "../components/Shared/Footer";
import Navbar from "../components/Shared/Navbar";

export default function LandingLayout({ children }: any) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
