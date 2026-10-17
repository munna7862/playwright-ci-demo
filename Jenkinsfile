// Same pipeline in Jenkins (Ep 7). Based on the Playwright CI docs; needs the Docker Pipeline plugin
// and a "Secret text" credential with the id test-password.
pipeline {
  agent { docker { image
    'mcr.microsoft.com/playwright:v1.64.0-noble' } }
  environment {
    CI = 'true'
    TEST_PASSWORD = credentials('test-password')
  }
  stages {
    stage('Install') { steps { sh 'npm ci' } }
    stage('Test') { steps { sh 'npx playwright test' } }
  }
  post {
    always {
      junit 'results/junit.xml'
      archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
    }
  }
}
