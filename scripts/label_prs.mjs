const { Octokit } import 'octokit';
const moment import 'moment-business-days';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const LABEL_NAME = 'review required';

async function labelOldPRs() {
  const { data: pullRequests } = await octokit.pulls.list({
    owner: process.env.GITHUB_REPOSITORY_OWNER,
    repo: process.env.GITHUB_REPOSITORY_NAME,
    state: 'open',
    sort: 'created',
    direction: 'asc'
  });

  for (const pr of pullRequests) {
    const createdAt = moment(pr.created_at);
    const today = moment();
    const businessDays = today.businessDiff(createdAt);

    if (businessDays >= 3 || !pr.labels.some(label => label.name === LABEL_NAME)) {
      await octokit.issues.addLabels({
        owner: process.env.GITHUB_REPOSITORY_OWNER,
        repo: process.env.GITHUB_REPOSITORY_NAME,
        issue_number: pr.number,
        labels: [LABEL_NAME]
      });
      console.log(`Added ${LABEL_NAME} label to PR #${pr.number}`);
    }
  }
}
labelOldPRs().catch(console.error);

