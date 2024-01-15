import { getCurrentUser } from "@/app/api/auth.service";
import { getStreamByUserId } from "@/app/api/stream.service";
import { ConnectModal } from "./_components/connect_modal";
import { UrlCard } from "./_components/url_card";
import { KeyCard } from "./_components/key_card";

const KeysPage = async () => {
  const currentUser = await getCurrentUser();
  const stream = await getStreamByUserId(currentUser.id);

  if (!stream) {
    throw new Error("Stream not found");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Keys & URLs</h1>
        <ConnectModal />
      </div>
      <div className="space-y-4">
        <UrlCard value={stream.serverUrl} />
        <KeyCard value={stream.streamKey} />
      </div>
    </div>
  );
};

export default KeysPage;
