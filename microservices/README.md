# Microservices

## Setup Git

For the ormconfig.json with credentials to not appear on unchanged git files:
```
git config --replace-all --local filter.ormconfig.clean ./microservices/cleangit.sh
```

## Starting

You can start all servers with:
```
./start_all.sh watch
```
OR
```
./start_all.sh start
```