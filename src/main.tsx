import {Devvit} from '@devvit/public-api'

type PageProps = {
  setPage: (page: string) => void;
}

const PageWelcome = ({ setPage }: PageProps) => (
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
      <text>1️⃣ REDDITOR 2️⃣ PHYSICIST 3️⃣ DOCTOR 4️⃣ PLUMBER</text>
      <text>5️⃣ PROGRAMMER 6️⃣ LAWYER 7️⃣ ASTRONOMER</text>
    </vstack>
    <vstack gap="small">
      <text size="medium">To join, write in the comment: /join [profession_number]</text>
      <text size="medium">Example, for doctor: /join 3</text>
    </vstack>
    <button onPress={() => setPage('challenge')}>Start Game</button>
  </vstack>
);

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
    <hstack
      gap="medium"
    >
      <button size="medium">USA</button>
      <button size="medium">Canada</button>
      <button size="medium">India</button>
    </hstack>
    <hstack
      gap="medium"
    >
      <button onPress={() => setPage('welcome')}>Start Again</button>
      <button onPress={() => setPage('professional')}>Answer(temp)</button>
      <button onPress={() => setPage('victory')}>Victory(temp)</button>
    </hstack>
  </vstack>
);

const PageProfessional = ({ setPage }: PageProps) => (
  <vstack
    width="100%"
    height="100%"
    alignment="middle center"
    gap="large"
    backgroundColor="green"
  >
    <text size="xxlarge" color="white">🎯 Professional 🎯</text>
    <text size="large" color="white">"User" joined as physicist</text>
    <hstack
      gap="medium"
    >
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
    <hstack
      gap="medium"
    >
      <button onPress={() => setPage('welcome')}>Start Again</button>
    </hstack>
  </vstack>
);

Devvit.addCustomPostType({
  name: 'SkillSeeker',
  render: context => {
    const { useState } = context;
    const [page, setPage] = useState('welcome');

    let currentPage;
    switch (page) {
      case 'welcome':
        currentPage = <PageWelcome setPage={setPage} />;
        break;
      case 'challenge':
        currentPage = <PageChallenge setPage={setPage} />;
        break;
      case 'professional':
        currentPage = <PageProfessional setPage={setPage} />;
        break;
      case 'victory':
        currentPage = <PageVictory setPage={setPage} />;
        break;
      default:
        currentPage = <PageWelcome setPage={setPage} />;
    }

    return (
      <blocks>
        {currentPage}
      </blocks>
    )
  }
})

export default Devvit