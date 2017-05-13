pipeline {
  agent any

  parameters {
    choice(
      choices: 'dev\ntest\nlive',
      description: 'The stage to deploy to.',
      name: 'deploy_stage'
    )
    choice(
      choices: 'point\nminor',
      description: 'Increment the minor release or the point release',
      name: 'version_incr'
    )
  }
  stages {
    stage('prebuild') {
      steps {
        echo 'In the pre-build step. Install dependencies, run pre-build tests, etc. here.'
        //Install npm ,first run
        sh "python3 --version"
        sh "pip install awscli --upgrade --user"
        sh "export PATH=~/.local/bin:/usr/bin/aws:$PATH"
        sh "pip --version" 
        // This is for run only the first time
        //Install serverless manually on server
        //sh 'npm install -g serverless'
        //sh "export PATH=/usr/bin/serverless:$PATH"
        sh 'node -v'
        sh "aws ec2 describe-instances"
        sh 'serverless --version'
      }
    }
    stage('dev') {
      when {
        expression { params.deploy_stage == 'dev' }
      }
      steps {
        sh 'echo $HOME'
        echo 'In the dev build step.'
        sh "serverless deploy --stage development"
      }
    }
    stage('test') {
      when {
        expression { params.deploy_stage == 'test' }
      }
      steps {
        echo 'In the test build step.'
        sh "serverless deploy --stage test"
      }
    }
    stage('live') {
      when {
        expression { params.deploy_stage == 'live' }
      }
      steps {
        echo 'In the live build step.'
         sh "serverless deploy --stage live"
      }
    }
  }
  post {
    success {
      slackSend (color: '#00FF00', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' ")
    }
    failure {
      slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
    }

    always {
      slackSend (color: '#00FF00', message: "COMPLETE: Job '${env.GIT_COMMITTER_NAME} ${env.GIT_BRANCH}${env.GIT_PREVIOUS_SUCCESSFUL_COMMIT}${env.GIT_PREVIOUS_COMMIT}${env.GIT_BRANCH}${env.GIT_AUTHOR_NAME}${env.GIT_COMMITTER_NAME}${env.GIT_AUTHOR_EMAIL}${env.GIT_COMMITTER_EMAIL} [${env.BUILD_NUMBER}]'
       (${env.BUILD_URL})")
    }
  }

}