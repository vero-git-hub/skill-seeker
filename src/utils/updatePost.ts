// utils/updatePost.ts
export async function updatePost(
    post: { edit: (content: string) => Promise<void> },
    reddit: any,
    currentLevel: number,
    waitingForRole: string | null,
    currentQuestion: string,
    activePlayer: string | null
) {
    await post.edit(`🔄 **SkillSeeker Challenge**  
    - Current level: ${currentLevel}  
    - ${waitingForRole ? `Specialist required: ${waitingForRole}` : `Currently playing: ${activePlayer || 'nobody'}`}  
    - Next question: ${currentQuestion}  
    - To join, write \`!join ${waitingForRole}\``);
  }
  