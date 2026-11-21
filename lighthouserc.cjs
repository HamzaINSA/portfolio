// Lighthouse CI (milestone M6). Audits the production build in dist/ on every PR.
// Reports stay local (.lighthouseci/) and are uploaded as a CI artifact: nothing is sent to a public server.
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/',
        'http://localhost/training',
        'http://localhost/projects',
        'http://localhost/about',
        'http://localhost/ask',
      ],
      // Median of 3 runs, to smooth out the noise of shared CI machines.
      numberOfRuns: 3,
      settings: { chromeFlags: '--no-sandbox --headless=new' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './.lighthouseci' },
  },
};
