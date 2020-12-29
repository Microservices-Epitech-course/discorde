#!/bin/bash

sed "s/  \"host\": \".*\",/  \"host\": \"<HOST>\",/" $@ | sed "s/  \"port\": \".*\",/  \"port\": \"<PORT>\",/" | sed "s/  \"username\": \".*\",/  \"username\": \"<USER>\",/" | sed "s/  \"password\": \".*\",/  \"password\": \"<PASSWORD>\",/" | sed "s/  \"database\": \".*\",/  \"database\": \"<DATABASE>\",/"
