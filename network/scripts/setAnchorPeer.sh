#!/bin/bash

export CHANNEL_NAME=medtrackchannel
export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/orderer.medtrack.com/orderers/orderer1.orderer.medtrack.com/msp/tlscacerts/tlsca.orderer.medtrack.com-cert.pem

peer channel update -o orderer1.orderer.medtrack.com:7050 \
    --ordererTLSHostnameOverride orderer1.orderer.medtrack.com \
    -c $CHANNEL_NAME \
    -f ./channel-artifacts/RetailerMSPanchors.tx \
    --tls --cafile $ORDERER_CA
