import { checkFollowUser } from "@/app/api/follow.service";
import { getUserByUserName } from "@/app/api/user.service";
import { notFound } from "next/navigation";
import { Actions } from "./_component/actions";

// Clerk use username
interface UserPageProps {
  params: {
    username: string;
  };
}

export const UserPage = async ({ params }: UserPageProps) => {
  const user = await getUserByUserName(params.username);

  if (!user) {
    notFound();
  }

  const isFollowing = await checkFollowUser(user.id);
  return (
    <div className="flex flex-col gap-y-4">
      <p>User : {user.username}</p>
      <p>User : {user.id}</p>
      <p>is follow : {`${isFollowing}`}</p>
      <Actions userId={user.id} isFollowing={isFollowing} />
    </div>
  );
};

export default UserPage;
