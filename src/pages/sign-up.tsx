import * as React from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FaTwitch, FaDiscord, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function SignUpPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPass, setConfirmPass] = React.useState<string>("");

  const handleEmailSignUp = async () => {
    if (!email.length) {
      toast.error("Email is required!!", { theme: "colored" });
      return;
    }
    if (password !== confirmPass) {
      toast.error("Passwords do not match.", { theme: "colored" });
      return;
    }
    if (password === confirmPass) {
      console.log("Ready to sign UP!");
    }
  };

  if (session) {
    return router.push("/app");
  }
  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex flex-col">
        <Link href="/">
          <div className="p-6 flex items-center justify-start text-lg gap-2 w-fit cursor-pointer">
            <MdOutlineKeyboardBackspace />
            <span>Back To Home</span>
          </div>
        </Link>
        <div className="flex flex-1 w-full items-center justify-center">
          <div className="flex flex-col">
            <h2 className="text-3xl font-semibold mb-4">
              Welcome to Stream Tools
            </h2>
            <div className="shadow-lg rounded-lg p-8 flex flex-col items-center gap-4">
              <div className="flex items-center flex-col justify-between gap-2">
                <p className="self-start text-gray-400">Sign up with</p>
                <div className="flex gap-2">
                  <div className="cursor-pointer flex gap-2 items-center text-white bg-purple-500 px-8 py-2 font-semibold rounded-lg">
                    <FaTwitch />
                  </div>
                  <div className="cursor-pointer flex gap-2 items-center text-white bg-blue-500 px-8 py-2 font-semibold rounded-lg">
                    <FaDiscord />
                  </div>
                  <div className="cursor-pointer flex gap-2 items-center text-white bg-red-500 px-8 py-2 font-semibold rounded-lg">
                    <FaYoutube />
                  </div>
                </div>
                <div className="flex gap-2 items-center w-full my-4">
                  <div className="h-px w-16 bg-gray-300 grow-1 flex"></div>
                  <span className="text-gray-400">Or continue with</span>
                  <div className="h-px w-16 bg-gray-300 grow-1 flex"></div>
                </div>
                <div className="mb-2 w-full">
                  <label
                    className="block text-gray-400 text-sm font-bold mb-1"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                  />
                </div>
                <div className="mb-2 w-full">
                  <label
                    className="block text-gray-400 text-sm font-bold mb-1"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                  />
                </div>
                <div className="mb-2 w-full">
                  <label
                    className="block text-gray-400 text-sm font-bold mb-1"
                    htmlFor="confirmPass"
                  >
                    Confirm Password
                  </label>
                  <input
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="confirmPass"
                    type="password"
                  />
                </div>
                <div
                  onClick={handleEmailSignUp}
                  className="mt-2 cursor-pointer w-full px-3 py-2 rounded-lg bg-gray-900 text-neutral-300 flex items-center justify-center font-semibold"
                >
                  Sign Up
                </div>
                <p className="text-gray-400 self-start">
                  Or{" "}
                  <Link href={"/sign-in"}>
                    <span className="text-black cursor-pointer">Sign In</span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:block md:w-1/2">
        <img src="/streamer.jpg" className="h-screen object-cover w-full" />
      </div>
    </div>
  );
}
