import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent, WebhookEventType } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { ClerkEvents } from "../../constants";

export const POST = async (req: Request) => {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local",
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occured", {
      status: 400,
    });
  }

  // Get the ID and type
  // const { id } = evt.data;
  const eventType = evt.type;
  await handleClerkEvents(eventType, payload);

  return new Response("", { status: 200 });
};

export const handleClerkEvents = async (
  event: WebhookEventType,
  payload: any,
) => {
  const { data } = payload;
  switch (event) {
    case ClerkEvents.UserCreated:
      return await db.user.create({
        data: {
          externalUserId: data.id,
          username: data.username,
          imageUrl: data.image_url,
          stream: {
            create: {
              name: `${payload.data.username}'s stream`,
            },
          },
        },
      });
    case ClerkEvents.UserUpdated:
      return await db.user.update({
        where: {
          externalUserId: data.id,
        },
        data: {
          username: data.username,
          imageUrl: data.image_url,
        },
      });
    case ClerkEvents.UserDeleted:
      return await db.user.delete({
        where: {
          externalUserId: data.id,
        },
      });

    default:
      return;
  }
};
