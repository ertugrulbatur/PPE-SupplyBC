#!/bin/bash

kubectl apply -f orderer-deployment.yaml
kubectl apply -f ca-deployment.yaml
kubectl apply -f org1peer0-deployment.yaml
kubectl apply -f org1peer1-deployment.yaml
kubectl apply -f org2peer0-deployment.yaml
kubectl apply -f org2peer1-deployment.yaml
kubectl apply -f org3peer0-deployment.yaml
kubectl apply -f org3peer1-deployment.yaml