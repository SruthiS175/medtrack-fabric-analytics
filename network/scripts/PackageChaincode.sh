#!/bin/bash

set -e

CC_NAME=medtrackcc
CC_VERSION=1.0
CC_SRC_PATH=/opt/gopath/src/github.com/hyperledger/fabric/chaincode/medtrack-ts
CC_RUNTIME_LANGUAGE=node
CC_LABEL=${CC_NAME}_${CC_VERSION}

peer lifecycle chaincode package ${CC_NAME}.tar.gz \
    --path $CC_SRC_PATH \
    --lang $CC_RUNTIME_LANGUAGE \
    --label $CC_LABEL

echo "✅ Chaincode packaged: ${CC_NAME}.tar.gz"
