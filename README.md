# L6M5-software-engineering-and-devops

Development artifacts for my 'secure' application, developed as required for the level 6 module "Software Engineering and DevOps"

## Overview

This application has been built with DevOps principles in-mind and therefore deploys automatically through GitHub actions to a Kubernetes (currently k3s) cluster.

Alternatively, local development is also possible but will require a local Kubernetes cluster configured with a tool such as [Docker desktop](https://www.docker.com/products/docker-desktop/) (with Kubernetes cluster enabled in settings) or [minikube](https://minikube.sigs.k8s.io/).

## Structure

L6M5-software-engineering-and-devops

```
├─── application
│    └ The source code for the backend application
├─── frontend
│    └ The source code for the frontend application
└─── infrastructure
     └ The kubernetes manifests required to deploy the application to the cluster
```

## Workflow Setup

To deploy with workflows you'll need a service account, cluster role, and cluster role binding

> kubectl apply -f extra\clusterrole.yaml

> kubectl get secret github-actions-token -o yaml -n l6m5-software-engineering-and-devops

> Place the secret in GitHub Actions as KUBERNETES_SECRET

> Don't forget the server URL as KUBERNETES_CONTROLPLANE either

## Development setup

1. Ensure docker is installed and currently running

2. Ensure Node.js is installed, or alternatively use a tool like fnm or nvm
> The version for each application is detailed in the .nvmrc file (currently v20.15 should be installed)

3. Enter the "/application" directory and execute "npm install"

4. Now, ideally in a seperate terminal session, enter the "/frontend" directory and execute "npm install"

5. In the root of the repository execute the docker command "docker compose up -d" to start a instance of the database
> Live output of this can be viewed by alternatively running "docker compose up" without the "-d" argument

> This can be deleted and shutdown by executing "docker compose down"

6. In each terminal session for "/application" and "/frontend" the command "npm run dev" can be executed to start development servers

7. The "/frontend" dev server will now print an address (likely [localhost:5173](https://localhost:5173/)) that can be accessed in a browser

8. The application should now be running!

## Automated tests

The automated tests for each application can be ran by executing the "npm run test" command in either "/application" or "/frontend" folders respectively.