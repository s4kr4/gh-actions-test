import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const labelsToNotify = ['review required', 'Priority: High'];

async function notifyPRsToSlack() {
  const { data: pullRequests } = await octokit.rest.pulls.list({
    owner: process.env.GITHUB_REPOSITORY_OWNER,
    repo: process.env.GITHUB_REPOSITORY_NAME,
    state: 'open',
    sort: 'created',
    direction: 'asc'
  });

  const prsToNotify = [];
  for (const pr of pullRequests) {
    if (pr.labels.some(label => labelsToNotify.includes(label.name))) {
      prsToNotify.push(pr);
    }
  }

  if (prsToNotify.length > 0) {
    console.log(`Check PRs ${prsToNotify.map(pr => `#${pr.number}`).join(', ')}`);
  }
}
notifyPRsToSlack().catch(console.error);
