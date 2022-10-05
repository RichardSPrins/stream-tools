import * as React from "react";
import { IconType } from "react-icons";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { FaTwitch, FaDiscord, FaYoutube } from "react-icons/fa";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import {
  ClientSafeProvider,
  getProviders,
  getSession,
  LiteralUnion,
  signIn,
} from "next-auth/react";
import { BuiltInProviderType } from "next-auth/providers";
import { Button, Input } from "@mantine/core";
import { useRouter } from "next/router";

type SignInPageProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  > | null;
};

const providersConfig: { [key: string]: { icon: any; color: string } } = {
  discord: {
    icon: <FaDiscord />,
    color: "bg-blue-500",
  },
  twitch: {
    icon: <FaTwitch />,
    color: "bg-purple-500",
  },
  google: {
    icon: <FaYoutube />,
    color: "bg-red-500",
  },
};

export default function SignInPage({ providers }: SignInPageProps) {
  const router = useRouter();
  const { callbackUrl } = router.query;
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
            <h2 className="text-3xl font-semibold mb-2">
              Welcome to Stream Tools!
            </h2>
            <p className="mb-2">Log in below to get started.</p>
            <div className="rounded-lg p-8 flex flex-col items-center gap-4 bg-[#1A1A1B]">
              <div className="flex items-center flex-col justify-between gap-2">
                <p className="self-start text-gray-200">Sign in with</p>
                <div className="flex gap-2">
                  {Object.values(providers).map((provider) => {
                    return (
                      <div
                        key={provider.name}
                        onClick={() =>
                          signIn(provider.id, {
                            callbackUrl: callbackUrl
                              ? `${callbackUrl}`
                              : `${window.location.origin}/app`,
                          })
                        }
                        className={`cursor-pointer flex gap-2 items-center text-white ${
                          providersConfig[provider.id]?.color
                        } px-8 py-2 font-semibold rounded-lg`}
                      >
                        {providersConfig[provider.id]?.icon}
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2 items-center w-full my-4">
                  <div className="h-px w-16 bg-gray-200 grow-1 flex"></div>
                  <span className="text-gray-200">Or continue with</span>
                  <div className="h-px w-16 bg-gray-200 grow-1 flex"></div>
                </div>
                <div className="mb-2 w-full">
                  <label
                    className="block text-gray-200 text-sm font-bold mb-1"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                  />
                </div>
                <Button color={"brand.3"} fullWidth sx={{ color: "black" }}>
                  Sign In
                </Button>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: { destination: "/app" },
    };
  }
  return {
    props: {
      providers: await getProviders(),
    },
  };
}
