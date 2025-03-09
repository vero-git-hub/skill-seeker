// pages.SpecialistJoinedPage.tsx
import { Devvit } from "@devvit/public-api";

interface SpecialistJoinedPageProps {
  joinedSpecialist: { user: string; profession: string } | null;
  specialists: { [key: string]: string };
  onContinue: () => void;
}

export function SpecialistJoinedPage({
  joinedSpecialist,
  specialists,
  onContinue,
}: SpecialistJoinedPageProps) {
  return (
    <blocks>
      <vstack alignment="center middle" height="100%">
        {joinedSpecialist && (
          <text size="xlarge">
            ✅ {joinedSpecialist.user} joined as a {joinedSpecialist.profession}!
          </text>
        )}

        <text size="large">Current Specialists:</text>
        {Object.entries(specialists).map(([user, profession]) => (
          <text key={user}>
            🛠 {user} - {String(profession)}
          </text>
        ))}

        <button onPress={onContinue}>Continue</button>
      </vstack>
    </blocks>
  );
}
