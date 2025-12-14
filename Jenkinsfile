pipeline {
    agent any

    environment {
        CI = 'true'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Prettier Check') {
            steps {
                sh 'npx prettier --check .'
            }
        }
    }

    post {
        success {
            echo '✅ Jenkins CI passed'
        }
        failure {
            echo '❌ Jenkins CI failed'
        }
    }
}
