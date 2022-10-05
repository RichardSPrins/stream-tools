import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import AppLayout from "../../../layouts/AppLayout";
import { trpc } from "../../../utils/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";

export default function AppResourcesMainPage() {
  // const { data: currentUser, status } = trpc.useQuery(["auth.getAuthUser"]);
  return (
    <AppLayout>
      <p className="text-4xl font-bold">Free Resources</p>
    </AppLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
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

  return {
    props: {},
  };
}
