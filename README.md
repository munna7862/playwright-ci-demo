# playwright-ci-demo

Demo project for the free **CI/CD for Testers** course by [@testlab.with.ai](https://www.instagram.com/testlab.with.ai/).

- `app/server.js`: a tiny demo app (a copy of Restful-Booker's API plus a login page), no dependencies
- `tests/`: Playwright UI and API tests
- `.github/workflows/playwright.yml`: tests on every push and pull request, with HTML report + JUnit artifacts (Ep 2–4)
- `.github/workflows/nightly.yml`: nightly run, sharded across 2 machines, reports merged (Ep 5)
- `.github/workflows/docker.yml`: the same tests inside the official Playwright Docker image (Ep 8)
- `Jenkinsfile`, `azure-pipelines.yml`: the same pipeline in Jenkins and Azure DevOps (Ep 7)

Run locally:

```bash
npm ci
npx playwright install chromium
npx playwright test
```

The login test reads `TEST_PASSWORD` from a GitHub secret in CI (Ep 6); locally it uses the demo password.
