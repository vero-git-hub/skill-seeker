// main.tsx
import {Devvit} from '@devvit/public-api';
import {PageWelcome} from '@pages/PageWelcome.js';
import {PageTeam} from '@pages/PageTeam.js';
import {PageChallenge} from '@pages/PageChallenge.js';
import {PageVictory} from '@pages/PageVictory.js';
import {questions} from '@utils/questions.js';
import {sendInvitation} from '@utils/sendInvitation.js';

Devvit.configure({
  redditAPI: true,
});

Devvit.addCustomPostType({
  name: 'SkillSeeker',
  render: context => {
    const {useState, useForm, reddit, subredditName, postId} = context;
    const [page, setPage] = useState('welcome');

    const specialists = [...new Set(questions.map(q => q.requiredSpecialist))];

    const postLink = `https://www.reddit.com/r/${subredditName}/comments/${postId}`;

    const inviteForm = useForm(
      {
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

    function handleInvite() {
      console.log("📩 Showing invite form...");
      context.ui.showForm(inviteForm);
    }

    let currentPage;
    switch (page) {
      case 'welcome':
        currentPage = <PageWelcome
                        setPage={setPage}
                        specialists={specialists}
                        onInvite={handleInvite}
                      />;
        break;
      case 'challenge':
        currentPage = <PageChallenge setPage={setPage} />;
        break;
      case 'team':
        currentPage = <PageTeam
                        setPage={setPage}
                        specialists={specialists}
                        onInvite={handleInvite}
                      />;
        break;
      case 'victory':
        currentPage = <PageVictory setPage={setPage} />;
        break;
      default:
        currentPage = <PageWelcome 
                        setPage={setPage}
                        specialists={specialists}
                        onInvite={handleInvite}
                      />;
    }

    return (
      <blocks>
        {currentPage}
      </blocks>
    )
  }
})

export default Devvit;