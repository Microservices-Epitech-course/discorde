#! /bin/bash

if [ "$1" == "" ]; then
  exit
fi;

trap 'killall' INT

killall() {
  trap '' INT TERM
  echo "*** Shut Down ***"
  kill -TERM 0
  wait
  echo DONE
}

npm run $1 --prefix ./chaussettes/ &
npm run $1 --prefix ./hermes/ &
npm run $1 --prefix ./jbdm/ &
npm run $1 --prefix ./kamoulox/ &
npm run $1 --prefix ./marine/ &
npm run $1 --prefix ./sven/ &
npm run $1 --prefix ./yahoo/ &

cat