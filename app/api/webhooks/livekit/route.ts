import { headers } from "next/headers";
import { WebhookEvent, WebhookReceiver } from "livekit-server-sdk";

import { db } from "@/lib/db";
import { LiveKitEvents } from "../../constants";

const webhookReceiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!,
);

export const POST = async (req: Request) => {
  const body = await req.text();
  const headerPayload = headers();
  const authorization = headerPayload.get("Authorization");

  if (!authorization) {
    return new Response("No authorization header", { status: 400 });
  }

  const event: WebhookEvent = webhookReceiver.receive(body, authorization);
  await handleLiveKitEvents(event);
};

export const handleLiveKitEvents = async (event: WebhookEvent) => {
  const eventType = event.event;

  switch (eventType) {
    case LiveKitEvents.IngressStarted:
      return await db.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: true,
        },
      });
    case LiveKitEvents.IngressStarted:
      return await db.stream.update({
        where: {
          ingressId: event.ingressInfo?.ingressId,
        },
        data: {
          isLive: false,
        },
      });

    default:
      return;
  }
};
