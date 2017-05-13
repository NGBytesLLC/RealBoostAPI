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
        sh "aws configure set aws_access_key_id AKIAJIDUT4ZRSFSD7HUA"
        sh "aws configure set aws_secret_access_key 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"
        sh "aws configure set default.region us-west-2"
        sh "aws configure list"
        //Install serverless manually on server
        //sh 'npm install -g serverless'
        sh "export PATH=/usr/bin/serverless:$PATH"
        sh 'node -v'
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
        sh "./build/testCaller.sh test ${params.version_incr}"
        //sshagent (credentials: ['GVT Robot']) {
        //  sh 'git push --tags'
        //}
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

}