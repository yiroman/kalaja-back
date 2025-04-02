    pipeline{
    agent any
    options {
        timeout(time:10, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '5', artifactNumToKeepStr: '5'))
    }
    environment {
        REGISTRY = 'repos.tlaxcala.gob.mx:5050/ddt/omg-eventos'
        USER = 'gitlab-ci-token'
        SERVER_IP = '10.50.230.14'
        SERVER_IP_DEV = '10.50.230.95'
        SERVER_USER = 'deployer'
        TAG = sh(returnStdout: true, script: "git rev-parse --short=10 HEAD").trim()
    }
    stages{
        stage('Pull changes'){
            steps{
                script{
                    if(env.BRANCH_NAME == 'main'){
                        sh 'git pull origin ${BRANCH_NAME}'
                    }
                }
            }
        }
        stage('Push Docker image'){
            steps{
                script{
                    withCredentials([string(credentialsId: 'access-token-omg-eventos', variable: 'ACCESS_TOKEN')]){
                        if(env.BRANCH_NAME == 'stg'){
                            sh 'docker build -f dev.Dockerfile -t $REGISTRY:$TAG -t $REGISTRY:stg-latest .'
                            sh 'echo $ACCESS_TOKEN | docker login -u ${USER} --password-stdin $REGISTRY'
                            sh 'docker push $REGISTRY:$TAG'
                            sh 'docker push $REGISTRY:stg-latest'
                            sh 'docker logout $REGISTRY'
                        }
                        if(env.BRANCH_NAME == 'main'){
                            sh 'docker build -f prod.Dockerfile -t $REGISTRY:$TAG -t $REGISTRY:latest .'
                            sh 'echo $ACCESS_TOKEN | docker login -u ${USER} --password-stdin $REGISTRY'
                            sh 'docker push $REGISTRY:$TAG'
                            sh 'docker push $REGISTRY:latest'
                            sh 'docker logout $REGISTRY'
                        }
                    }
                }
            }
        }
        stage('Runing Docker image'){
            steps{
                script{
                    if(env.BRANCH_NAME == 'stg'){
                        withCredentials([
                            sshUserPrivateKey(credentialsId: 'ssh-key-deployer-dev', keyFileVariable: 'keyfile'),
                            string(credentialsId: 'access-token-omg-eventos', variable: 'ACCESS_TOKEN'),
                            string(credentialsId: 'mongo-url-eventos-dev', variable: 'MONGO_URL'),
                            string(credentialsId: 'jwt-key-eventos', variable: 'JWT_KEY'),
                            string(credentialsId: 'secret-cookie-eventos', variable: 'SECRET_COOKIE'),
                        ]){
                            sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP_DEV "echo $ACCESS_TOKEN | docker login -u ${USER} --password-stdin $REGISTRY"'
                            sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP_DEV "docker pull $REGISTRY:stg-latest"'
                            sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP_DEV "docker rm -f node-express-eventos | true"'
                            sh """
                                ssh -i ${keyfile} -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP_DEV "docker run -d -p 9007:3000 \
                                    --mount type=bind,source=/home/omg/app_omg_eventos/omg-eventos/app/logs,target=/usr/src/logs \
                                    --mount type=bind,source=/home/omg/app_omg_eventos/omg-eventos/app/uploads,target=/usr/src/uploads \
                                    --env MONGO_URL='${MONGO_URL}' \
                                    --env JWT_KEY='${JWT_KEY}' \
                                    --env SECRET_COOKIE='${SECRET_COOKIE}' \
                                    --restart always \
                                    --name node-express-eventos $REGISTRY:stg-latest"
                            """
                            sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP_DEV "docker logout $REGISTRY"'
                        }
                    }
                    if(env.BRANCH_NAME == 'main'){
                        withCredentials([
                            sshUserPrivateKey(credentialsId: 'ssh-key-deployer-gato', keyFileVariable: 'keyfile'),
                            string(credentialsId: 'access-token-omg-eventos', variable: 'ACCESS_TOKEN'),
                            string(credentialsId: 'mongo-url-eventos', variable: 'MONGO_URL'),
                            string(credentialsId: 'jwt-key-eventos', variable: 'JWT_KEY'),
                            string(credentialsId: 'secret-cookie-eventos', variable: 'SECRET_COOKIE'),
                        ]){
                            sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo $ACCESS_TOKEN | docker login -u ${USER} --password-stdin $REGISTRY"'
                            sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "docker pull $REGISTRY"'
                            sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "docker rm -f node-express-eventos | true"'
                            sh """
                                ssh -i ${keyfile} -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "docker run -d -p 9007:3000 \
                                    --mount type=bind,source=/home/gato/app_omg_eventos/omg-eventos/app/logs,target=/usr/src/logs \
                                    --mount type=bind,source=/home/gato/app_omg_eventos/omg-eventos/app/uploads,target=/usr/src/uploads \
                                    --env MONGO_URL='${MONGO_URL}' \
                                    --env JWT_KEY='${JWT_KEY}' \
                                    --env EMISOR_JWT='omg_eventos' \
                                    --env SECRET_COOKIE='${SECRET_COOKIE}' \
                                    --restart always \
                                    --name node-express-eventos $REGISTRY"
                            """
                            sh 'ssh -i ${keyfile} -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "docker logout $REGISTRY"'
                        }
                    }
                }
            }
        }
    }
}
