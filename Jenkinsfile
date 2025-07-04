pipeline {
    agent any
    tools {
        jdk 'jdk17'
        nodejs 'node23'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout from Git') {
            steps {
                git 'https://github.com/awsbasava6/swiggy-success.git'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    sh '''
                        $SCANNER_HOME/bin/sonar-scanner \
                        -Dsonar.projectName=Swiggy \
                        -Dsonar.projectKey=Swiggy \
                        -Dsonar.sources=. \
                        -Dsonar.host.url=http://3.87.3.13:9000
                    '''
                }
            }
        }
        stage('Quality Gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: true, credentialsId: 'Sonar-token'
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('OWASP FS Scan') {
            steps {
                dependencyCheck additionalArguments: '--scan ./ --disableYarnAudit --disableNodeAudit', odcInstallation: 'DP-Check'
                dependencyCheckPublisher pattern: '**/dependency-check-report.xml'
            }
        }
        stage('Trivy FS Scan') {
            steps {
                sh 'trivy fs . > trivyfs.txt'
            }
        }
        stage('Docker Build & Push') {
            steps {
                script {
                    withDockerRegistry(credentialsId: 'docker-creds', toolName: 'docker') {
                        sh 'docker build -t swiggy .'
                        sh 'docker tag swiggy awsbasava6/swiggy:latest'
                        sh 'docker push awsbasava6/swiggy:latest'
                    }
                }
            }
        }
        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image awsbasava6/swiggy:latest > trivy.txt'
            }
        }
        stage('Deploy to Container') {
            steps {
                // Optional: Clean up existing container
                sh '''
                    docker rm -f swiggy || true
                    docker run -d --name swiggy -p 3000:3000 awsbasava6/swiggy:latest
                '''
            }
        }
    }
}
post {
        always {
            archiveArtifacts artifacts: '**/trivy*.txt, **/dependency-check-report.xml', allowEmptyArchive: true
        }
    }
