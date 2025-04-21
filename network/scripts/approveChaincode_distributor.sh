#!/bin/bash

set -e

CHANNEL_NAME=medtrackchannel
CC_NAME=medtrackcc
CC_VERSION=1.0
CC_SEQUENCE=1
CC_LABEL=${CC_NAME}_${CC_VERSION}
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/orderer.medtrack.com/orderers/orderer1.orderer.medtrack.com/msp/tlscacerts/tlsca.orderer.medtrack.com-cert.pem

export CORE_PEER_ADDRESS=peer0.distributor.medtrack.com:10051
export CORE_PEER_LOCALMSPID=DistributorMSP
export CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/distributor.medtrack.com/users/Admin@distributor.medtrack.com/msp
export CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/distributor.medtrack.com/peers/peer0.distributor.medtrack.com/tls/ca.crt

PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep "$CC_LABEL" | awk -F "[, ]+" '{print $3}')
echo "📦 PACKAGE_ID: $PACKAGE_ID"

peer lifecycle chaincode approveformyorg \
  -o orderer1.orderer.medtrack.com:7050 \
  --ordererTLSHostnameOverride orderer1.orderer.medtrack.com \
  --channelID $CHANNEL_NAME \
  --name $CC_NAME \
  --version $CC_VERSION \
  --package-id $PACKAGE_ID \
  --sequence $CC_SEQUENCE \
  --tls --cafile $ORDERER_CA

echo "✅ Chaincode approved by Distributor"
