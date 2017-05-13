PROJECT_PATH=/var/lib/jenkins/workspace/Pipeline/
VERSION=`git describe --abbrev=0 --tags`

#replace . with space so can split into an array
VERSION_BITS=(${VERSION//./ })

#get number parts and increase last one by 1
VNUM1=${VERSION_BITS[0]}
VNUM2=${VERSION_BITS[1]}
VNUM3=${VERSION_BITS[2]}
VNUM3=$((VNUM3+1))

#create new tag
NEW_TAG="$VNUM1.$VNUM2.$VNUM3"

echo "Updating $VERSION to $NEW_TAG"

#get current hash and see if it already has a tag
GIT_COMMIT=`git rev-parse HEAD`
NEEDS_TAG=`git describe --contains $GIT_COMMIT`

#only tag if no tag already (would be better if the git describe command above could have a silent option)
if [ -z "$NEEDS_TAG" ]; then
  echo "Tagged with $NEW_TAG (Ignoring fatal:cannot describe - this means commit is untagged) "
  git tag $NEW_TAG
  git push --tags
else
  echo "Already a tag on this commit"
fi



function check_serverless {
  command -v serverless >/dev/null 2>&1 || { echo >&2 $'\n\n\n------------------------ Serverless not installed.  Aborting.-------------------\n'; exit 1; }
  echo $'\n\n\n-----------------------------------Serverless framework found !!!--------------------------------------\n'
  #type serverless >/dev/null 2>&1 || { echo >&2 "I require foo but it's not installed.  Aborting."; exit 1; }
  #hash serverless 2>/dev/null || { echo >&2 "I require foo but it's not installed.  Aborting."; exit 1; }  
}

function quit {
  exit
}

function deploy {
  sudo chmod -R 777 ${PROJECT_PATH}
  cd ${PROJECT_PATH}
  echo  $'\n\n\n----------------------------- Cleaning the project folder --------------------------\n'
  sudo chmod -R 777 ${PROJECT_PATH}
  sudo chmod -R 777 ${PROJECT_PATH}.serverless/
  echo $'\n\n\n-------------------------------Deploying to the S3 instance ------------------------\n'
  sudo serverless deploy -s dev
  pwd
	cd .. 
	echo $'\n\n\n---------------------------------Removing old folders ---------------------------------\n'
  #sudo rm -R Serverless_Testing_0.1_ws-cleanup*/
  echo $'\n\n\n...............................System sucesfully deployed!!..............................\n'
}

check_serverless
deploy
quit







