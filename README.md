# playwright-ci-demo

[![Playwright Tests](https://github.com/munna7862/playwright-ci-demo/actions/workflows/playwright.yml/badge.svg)](https://github.com/munna7862/playwright-ci-demo/actions/workflows/playwright.yml)
[![Nightly (sharded)](https://github.com/munna7862/playwright-ci-demo/actions/workflows/nightly.yml/badge.svg)](https://github.com/munna7862/playwright-ci-demo/actions/workflows/nightly.yml)
[![Tests in Docker](https://github.com/munna7862/playwright-ci-demo/actions/workflows/docker.yml/badge.svg)](https://github.com/munna7862/playwright-ci-demo/actions/workflows/docker.yml)

Companion repository for the free **CI/CD for Testers** course by [@testlab.with.ai](https://www.instagram.com/testlab.with.ai/). It is a small Playwright suite plus the same pipeline written for GitHub Actions, Jenkins and Azure DevOps, so each episode can point at working configuration.

## What is in it

- A zero-dependency demo app (`app/server.js`): a Restful-Booker style booking API, a bookings page and a login page, served on port 3001.
- Five Playwright tests (UI and API) that run against that app in Chromium.
- One pipeline per CI system, each producing an HTML report and JUnit results.

## Tech stack

- Node.js, TypeScript
- Playwright Test 1.64 (Chromium only)
- GitHub Actions, Jenkins (declarative pipeline), Azure Pipelines
- Official Playwright Docker image `mcr.microsoft.com/playwright:v1.64.0-noble`

## Run locally

```bash
npm ci
npx playwright install chromium
npx playwright test
```

Playwright starts the demo app automatically through `webServer` in `playwright.config.ts`. To run the app on its own, use `npm start` and open `http://localhost:3001/login`.

The login test reads `TEST_PASSWORD` from the environment. In CI it comes from a secret; locally it falls back to the demo password.

## Project structure

```
app/server.js            Demo booking API + login and bookings pages
tests/
  api.spec.ts            GET and POST /booking
  bookings.spec.ts       Bookings page lists seeded bookings
  login.spec.ts          Valid and invalid login
playwright.config.ts     Chromium project, retries and JUnit reporter in CI
.github/workflows/
  playwright.yml         Every push and PR to main; uploads HTML report + JUnit (Ep 2-4)
  nightly.yml            Nightly run sharded over 2 machines, blob reports merged (Ep 5)
  docker.yml             Same tests inside the Playwright Docker image (Ep 8)
Jenkinsfile              Same pipeline in Jenkins (Ep 7)
azure-pipelines.yml      Same pipeline in Azure DevOps (Ep 7)
```

## CI

| Pipeline | Trigger | Output |
| --- | --- | --- |
| `playwright.yml` | push / pull request to `main` | `playwright-report` and `junit-results` artifacts |
| `nightly.yml` | nightly schedule, manual | per-shard blob reports merged into one HTML report |
| `docker.yml` | push to `main`, manual | tests run in the Playwright container, no browser install step |
| `Jenkinsfile` | Jenkins job | JUnit publish + archived HTML report (uses a `test-password` credential) |
| `azure-pipelines.yml` | push to `main` | JUnit results published to Azure DevOps (uses a `TEST_PASSWORD` variable) |

Secrets (Ep 6): set `TEST_PASSWORD` as a repository secret for the GitHub workflows.
