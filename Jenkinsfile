pipeline {
    agent any
    
    tools {
        nodejs 'Node22'  // Make sure this NodeJS installation is configured in Jenkins
    }
    
    environment {
        // Set environment variables
        NODE_ENV = 'production'
        // Add GitHub credentials if needed for deployment
        GITHUB_CREDENTIALS = credentials('github-credentials')
        // Docker Hub credentials removed
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                // Use bat instead of sh on Windows
                bat 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                bat 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                bat 'npm test'
                // Publish test results
                junit allowEmptyResults: true, testResults: 'junit-reports/*.xml'
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        
        stage('Deploy to GitHub') {
            when {
                branch 'main'  // Only deploy from main branch
            }
            steps {
                // GitHub tag for this version
                withCredentials([usernamePassword(credentialsId: 'github-credentials', 
                                                passwordVariable: 'GIT_PASSWORD', 
                                                usernameVariable: 'GIT_USERNAME')]) {
                    bat '''
                        git config user.email "jenkins@example.com"
                        git config user.name "Jenkins CI"
                        git tag -a v%BUILD_NUMBER% -m "Version %BUILD_NUMBER% built by Jenkins"
                        git push https://%GIT_USERNAME%:%GIT_PASSWORD%@github.com/Harshith-10/spark.git --tags
                    '''
                }
            }
        }
    }
    
    post {
        always {
            // Archive artifacts
            archiveArtifacts artifacts: '.next/**/*', fingerprint: true, allowEmptyArchive: true
            
            // Clean workspace
            cleanWs()
        }
        success {
            echo 'Build completed successfully!'
        }
        failure {
            echo 'Build failed!'
        }
    }
}