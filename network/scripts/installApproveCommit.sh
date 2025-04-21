#!/bin/bash

set -e

CC_NAME=medtrackcc
CC_VERSION=1.0
CC_SEQUENCE=1
CC_LABEL=${CC_NAME}_${CC_VERSION}
CHANNEL_NAME=medtrackchannel
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/orderer.medtrack.com/orderers/orderer1.orderer.medtrack.com/msp/tlscacerts/tlsca.orderer.medtrack.com-cert.pem

# Install chaincode
peer lifecycle chaincode install ${CC_NAME}.tar.gz

# Query package ID
PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "$CC_LABEL" | awk -F "[, ]+" '{print $3}')
echo "📦 PACKAGE_ID: $PACKAGE_ID"

# Approve chaincode
peer lifecycle chaincode approveformyorg \
    -o orderer1.orderer.medtrack.com:7050 \
    --ordererTLSHostnameOverride orderer1.orderer.medtrack.com \
    --channelID $CHANNEL_NAME \
    --name $CC_NAME \
    --version $CC_VERSION \
    --package-id $PACKAGE_ID \
    --sequence $CC_SEQUENCE \
    --tls --cafile $ORDERER_CA

# Commit chaincode
peer lifecycle chaincode commit \
    -o orderer1.orderer.medtrack.com:7050 \
    --ordererTLSHostnameOverride orderer1.orderer.medtrack.com \
    --channelID $CHANNEL_NAME \
    --name $CC_NAME \
    --version $CC_VERSION \
    --sequence $CC_SEQUENCE \
    --tls --cafile $ORDERER_CA \
    --peerAddresses peer0.retailer.medtrack.com:7051 \
    --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/retailer.medtrack.com/peers/peer0.retailer.medtrack.com/tls/ca.crt
