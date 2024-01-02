import { notFound } from "next/navigation";
import { checkFollowUser } from "@/app/api/follow.service";
import { checkBlockUser } from "@/app/api/block.service";
import { getUserByUserName } from "@/app/api/user.service";
import { Actions } from "./_components/actions";

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
  const isBlocked = await checkBlockUser(user.id);

  if (isBlocked) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-4">
      <p>User : {user.username}</p>
      <p>User : {user.id}</p>
      <p>is follow : {`${isFollowing}`}</p>
      <p>is blocked : {`${isBlocked}`}</p>
      <Actions userId={user.id} isFollowing={isFollowing} />
    </div>
  );
};

export default UserPage;
