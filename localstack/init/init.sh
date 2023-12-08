#!/bin/bash

set -x
echo "Initializing AWS services..."
awslocal ssm put-parameter --name /nestjsssmconfig/local/dbconnstring --value postgres://postgres:example@localhost:5432/postgres --type String
awslocal s3 mb s3://localstack-packages
set +x