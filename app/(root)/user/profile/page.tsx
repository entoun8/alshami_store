import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/data-service";
import UserProfileForm from "@/components/user/UserProfileForm";

export const metadata = {
  title: "My Profile",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.profileId) {
    redirect("/sign-in");
  }

  const user = await getUserById(session.user.profileId);

  return (
    <section className="wrapper my-8">
      <h1 className="h1-bold mb-6">My Profile</h1>
      <UserProfileForm user={user} />
    </section>
  );
}
