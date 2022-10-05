import * as React from "react";
import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import AppLayout from "../../layouts/AppLayout";
import { trpc } from "../../utils/trpc";
import { authOptions } from "../api/auth/[...nextauth]";
import {
  Button,
  CopyButton,
  Tooltip,
  ActionIcon,
  Input,
  Popover,
} from "@mantine/core";
import { HiOutlineClipboardCopy, HiCheck } from "react-icons/hi";
import { showNotification } from "@mantine/notifications";
import { useForm } from "@mantine/form";

export default function AppSettingsPage({
  data,
  req,
}: {
  data: any;
  req: any;
}) {
  // console.log("data", data);
  const ctx = trpc.useContext();
  const { data: config } = trpc.useQuery(["auth.getAuthUserConfig"]);
  const { data: currentUser } = trpc.useQuery(["auth.getAuthUser"]);
  const accountUpdate = trpc.useMutation("auth.updateAuthUserAccount", {
    onMutate: () => {
      ctx.cancelQuery(["auth.getAuthUser"]);

      let optimisticUpdate = ctx.getQueryData(["auth.getAuthUser"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["auth.getAuthUser"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["auth.getAuthUser"]);
    },
  });

  const donationLinkUpdate = trpc.useMutation("auth.saveAuthUserDonationLink", {
    onMutate: () => {
      ctx.cancelQuery(["auth.getAuthUserConfig"]);

      let optimisticUpdate = ctx.getQueryData(["auth.getAuthUserConfig"]);
      if (optimisticUpdate) {
        ctx.setQueryData(["auth.getAuthUserConfig"], optimisticUpdate);
      }
    },
    onSettled: () => {
      ctx.invalidateQueries(["auth.getAuthUserConfig"]);
    },
  });

  const accountForm = useForm({
    initialValues: {
      displayName: currentUser?.displayName || "",
      // donationLink: "",
    },
  });

  React.useEffect(() => {
    if (currentUser?.displayName) {
      accountForm.setFieldValue("displayName", currentUser.displayName);
      accountForm.resetDirty();
    }
  }, [currentUser]);

  const handleGenerateNewLink = () => {
    if (currentUser?.displayName && currentUser.displayName.length > 0) {
      donationLinkUpdate.mutate({
        donationLink: `http://localhost:3000/${currentUser.displayName}/donate`,
      });
    }
  };

  const handleUpdateAccount = async () => {
    if (accountForm.isDirty()) {
      console.log(accountForm.values);
      accountUpdate.mutate(accountForm.values);
    }
  };

  return (
    <AppLayout>
      <p className="text-4xl font-bold">Account Settings</p>
      <div className="max-w-4xl mx-auto mt-12 flex flex-col">
        <form onSubmit={accountForm.onSubmit(handleUpdateAccount)}>
          {accountForm.isDirty() && (
            <div className="flex justify-end">
              <Button type="submit" color="green">
                Save Changes
              </Button>
            </div>
          )}
          <div className="mb-6 w-full">
            <label
              className="block  text-sm font-bold mb-1"
              htmlFor="displayName"
            >
              Display Name
            </label>
            <Input
              {...accountForm.getInputProps("displayName")}
              placeholder="Add a display name"
              sx={{ maxWidth: "350px" }}
            />
            <p className="text-xs  mt-2">
              * This is necessary if you want to use a personalized name for
              your donation link
            </p>
          </div>
        </form>
        <div className="mb-6 w-full">
          <p className="block  text-sm font-bold mb-1">Donation Link</p>
          {!config?.donationLink && (
            <p className="text-xs  my-3">
              You do not have a donation link yet. Create one to start earning!
            </p>
          )}
          {config?.donationLink && (
            <div className="flex gap-2 items-center my-2 flex-wrap">
              <span className="text-sm text-white bg-[#333F44] px-4 py-2 rounded-sm truncate">
                {config?.donationLink}
              </span>
              <CopyButton value={config?.donationLink}>
                {({ copied, copy }) => (
                  <Tooltip
                    label={copied ? "Copied" : "Copy"}
                    withArrow
                    position="top"
                  >
                    <ActionIcon color={copied ? "teal" : "gray"} onClick={copy}>
                      {copied ? <HiCheck /> : <HiOutlineClipboardCopy />}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </div>
          )}
          <Button
            color="brand.4"
            sx={{ color: "black" }}
            loading={donationLinkUpdate.isLoading}
            onClick={handleGenerateNewLink}
          >
            Generate New Link
          </Button>
        </div>
        <div className="mb-6 w-full">
          <div className="flex gap-1 items-center mb-1">
            <p className="block  text-sm font-bold">Stripe Account</p>
          </div>
          <p className="text-xs  my-2">
            * This is necessary to collect donation payments. Please connect a
            Stripe account to use our services.
          </p>
          <Button
            color={"blue"}
            onClick={() => {
              if (window) {
                const url = `https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/app/account`;
                window.document.location.href = url;
              }
            }}
          >
            Connect Stripe
          </Button>
        </div>
        {data?.account && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </AppLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const params = context.query;
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: { destination: "/sign-in" },
    };
  }

  let stripeData;

  if (params.scope && params.code) {
    try {
      stripeData = await fetch("http://localhost:3000/api/verifyStripe", {
        method: "POST",
        body: JSON.stringify({
          scope: params.scope,
          code: params.code,
          userId: session.user?.id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      console.log("stripeData", stripeData);
      return { props: { data: stripeData, req: params } };
    } catch (error) {
      console.log("error", error);
      return { props: { data: error, req: params } };
    }
  } else {
    return {
      props: {},
    };
  }
}
