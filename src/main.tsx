import {Devvit} from '@devvit/public-api'
import {PageWelcome} from '@pages/PageWelcome.js'
import {PageTeam} from '@pages/PageTeam.js'
import {PageChallenge} from '@pages/PageChallenge.js'
import {PageVictory} from '@pages/PageVictory.js'
import {questions} from '@utils/questions.js'

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