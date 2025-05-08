import { getCurrentUser } from "@/app/api/auth.service";
import { getStreamByUserId } from "@/app/api/stream.service";
import { ToggleCard } from "./_components/toggle_card";

const ChatPage = async () => {
  const currentUser = await getCurrentUser();
  const stream = await getStreamByUserId(currentUser.id);

  if (!stream) throw new Error("Stream not found");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className=" text-2xl font-bold">Chat setting</h1>
      </div>
      <div className="space-y-4 ">
        <ToggleCard
          field="isChatEnabled"
          label="Enable chat"
          value={stream.isChatEnabled}
        />
        <ToggleCard
          field="isChatDelayed"
          label="Delay chat"
          value={stream.isChatDelayed}
        />
        <ToggleCard
          field="isChatFollowersOnly"
          label="Must be following to chat"
          value={stream.isChatFollowersOnly}
        />
      </div>
    </div>
  );
};

export default ChatPage;
