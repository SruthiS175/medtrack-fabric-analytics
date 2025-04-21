#!/bin/bash

set -e

CHANNEL_NAME=medtrackchannel
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/orderer.medtrack.com/orderers/orderer1.orderer.medtrack.com/msp/tlscacerts/tlsca.orderer.medtrack.com-cert.pem

peer channel create \
  -o orderer1.orderer.medtrack.com:7050 \
  --ordererTLSHostnameOverride orderer1.orderer.medtrack.com \
  -c $CHANNEL_NAME \
  -f ./channel-artifacts/medtrackchannel.tx \
  --outputBlock ./channel-artifacts/$CHANNEL_NAME.block \
  --tls --cafile $ORDERER_CA

echo "✅ Channel '$CHANNEL_NAME' created successfully!"
