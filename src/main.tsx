import {Devvit} from '@devvit/public-api'
import {questions} from '@utils/questions.js'

type PageProps = {
  setPage: (page: string) => void;
}

const PageWelcome = ({ setPage, specialists }: PageProps & {specialists: string[] }) => {
  const firstRow = specialists.slice(0, 4);
  const secondRow = specialists.slice(4);

  return (
    <vstack
      width="100%"
      height="100%"
      alignment="middle center"
      gap="medium"
      backgroundColor="lightblue"
    >
      <text size="xxlarge">🔮 SkillSeeker 🔮</text>
      <text size="large">Secret society of professionals... Before start, you need: </text>

      <vstack gap="small">
        <text>
          {firstRow.map((spec, index) => `${index + 1}️⃣ ${spec.toUpperCase()} `).join(' ')}
        </text>
        <text>
          {secondRow.map((spec, index) => `${index + 5}️⃣ ${spec.toUpperCase()} `).join(' ')}
        </text>
      </vstack>

      <vstack gap="small">
        <text size="medium">Write in the comment: /join [profession_number]</text>
      </vstack>

      <button onPress={() => setPage('team')}>Start Game</button>
    </vstack>
  );
}

const PageChallenge = ({ setPage }: PageProps) => (
  <vstack
    width="100%"
    height="100%"
    alignment="middle center"
    gap="large"
    backgroundColor="pink"
  >
    <text size="xxlarge">🏆 Challenge 🏆</text>
    <text size="large">In what country was Reddit created?</text>
    <hstack gap="medium">
      <button size="medium">USA</button>
      <button size="medium">Canada</button>
      <button size="medium">India</button>
    </hstack>
    <hstack gap="medium">
      <button onPress={() => setPage('welcome')}>Start Again</button>
      <button onPress={() => setPage('victory')}>Victory(temp)</button>
    </hstack>
  </vstack>
);

const PageTeam = ({ setPage, specialists }: PageProps & {specialists: string[] }) => (
  <vstack
    width="100%"
    height="100%"
    alignment="middle center"
    gap="large"
    backgroundColor="green"
  >
    <text size="xxlarge" color="white">🎯 Team 🎯</text>
    <vstack gap="small">
      {specialists.map((spec, index) => (
        <text key={index} size="small" color="white">
          {`${index + 1}️⃣ ${spec.toUpperCase()} - `}
        </text>
      ))}
    </vstack>
    <hstack gap="small">
      <button onPress={() => setPage('welcome')}>Start Again</button>
      <button onPress={() => setPage('challenge')}>Continue</button>
    </hstack>
  </vstack>
);

const PageVictory = ({ setPage }: PageProps) => (
  <vstack
    width="100%"
    height="100%"
    alignment="middle center"
    gap="large"
    backgroundColor="gray"
  >
    <text size="xxlarge" color="white">🎉 Victory 🎉</text>
    <text size="large" color="white">Congratulations! Your team of professionals has won.</text>
    <hstack gap="medium">
      <button onPress={() => setPage('welcome')}>Start Again</button>
    </hstack>
  </vstack>
);

Devvit.addCustomPostType({
  name: 'SkillSeeker',
  render: context => {
    const { useState } = context;
    const [page, setPage] = useState('welcome');

    const specialists = [...new Set(questions.map(q => q.requiredSpecialist))];

    let currentPage;
    switch (page) {
      case 'welcome':
        currentPage = <PageWelcome setPage={setPage} specialists={specialists} />;
        break;
      case 'challenge':
        currentPage = <PageChallenge setPage={setPage} />;
        break;
      case 'team':
        currentPage = <PageTeam setPage={setPage} specialists={specialists} />;
        break;
      case 'victory':
        currentPage = <PageVictory setPage={setPage} />;
        break;
      default:
        currentPage = <PageWelcome setPage={setPage} specialists={specialists} />;
    }

    return (
      <blocks>
        {currentPage}
      </blocks>
    )
  }
})

export default Devvit