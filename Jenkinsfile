// Same pipeline in Jenkins (example for Ep 7, based on the Playwright CI docs).
pipeline {
  agent { docker { image 'mcr.microsoft.com/playwright:v1.64.0-noble' } }
  environment {
    CI = 'true'
    TEST_PASSWORD = credentials('test-password')
  }
  stages {
    stage('Install') {
      steps { sh 'npm ci' }
    }
    stage('Test') {
      steps { sh 'npx playwright test' }
    }
  }
  post {
    always {
      junit 'results/junit.xml'
      archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
    }
  }
}
