# L6M5-software-engineering-and-devops

Development artifacts for my 'secure' application, developed as required for the level 6 module "Software Engineering and DevOps"

## Overview

This application has been built with DevOps principles in-mind and therefore deploys automatically through GitHub actions to a Kubernetes (currently k3s) cluster.

Alternatively, local development is also possible but will require a local Kubernetes cluster configured with a tool such as [Docker desktop](https://www.docker.com/products/docker-desktop/) (with Kubernetes cluster enabled in settings) or [minikube](https://minikube.sigs.k8s.io/).

> NOTE: A private container registry ~~is~~ will be in-use **(HOW WILL I GIVE TUTORS/MARKERS ACCESS TO THIS??? OR DO I MAKE A FINAL BUILD PUBLIC, WE'LL SEE...)**

## Structure

L6M5-software-engineering-and-devops
├─── application
│    └ The source code for the application
└─── infrastructure
     ├ The kubernetes manifests required to deploy the application to the cluster
     ├─── application
     ├─── namespace
     ├─── service
     └─── volume

## Workflow Setup

To deploy with workflows you'll need a service account, cluster role, and cluster role binding

> kubectl apply -f extra\clusterrole.yaml

> kubectl get secret github-actions-token -o yaml -n l6m5-software-engineering-and-devops

> Place the secret in GitHub Actions as KUBERNETES_SECRET

> Don't forget the server URL as KUBERNETES_CONTROLPLANE either