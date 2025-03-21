// utils/inviteForm.ts
import {sendInvitation} from "@utils/sendInvitation.js";

export function createInviteForm(
  useForm: any,
  reddit: any,
  postLink: string
) {
  return useForm(
      {
        title: "Invite a Player",
        cancelLabel: "Close",
        fields: [
          {
            type: "string",
            name: "inviteUsername",
            label: "Enter Reddit username to invite:",
          },
        ],
      },
      async (values) => {
        const username = values.inviteUsername;
        if (!username) {
          console.error("❌ Please enter a username.");
          return;
        }

        if (!reddit.sendPrivateMessage) {
          console.error("❌ `sendPrivateMessage` is not available on `reddit`.");
          return;
        }

        await sendInvitation(reddit, username, postLink);
        console.log("✅ Invitation sent!");
      }
    );
}