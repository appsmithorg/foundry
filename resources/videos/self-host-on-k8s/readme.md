# How To Self-host Appsmith On Kubernetes

Video Link [https://youtu.be/wZzYL1uZwds](https://youtu.be/wZzYL1uZwds)

Install k3s

```sh
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" sh -s -
```

Install Helm

```sh
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

Download Appsmith config values

```sh
curl -L https://bit.ly/3ETEgPT -o "$PWD/values.yml"
```

Add the Appsmith registry

```sh
helm repo add appsmith https://helm.appsmith.com
```

Update local repository

```sh
helm repo update
```

Create an Appsmith namespace

```sh
kubectl create namespace myappsmith
```

Add the `kUBECONFIG` variable

```sh
echo "export KUBECONFIG=/etc/rancher/k3s/k3s.yaml" >> ~/.bashrc
source ~/.bashrc
```

Install Appsmith

```sh
helm install appsmith appsmith/appsmith --namespace myappsmith
```

Create a NodePort service to expose the cluster

```sh
kubectl expose pod appsmith-0 --name=appsmith-srv --port=80 --type=NodePort -n myappsmith
kubectl describe service appsmith-srv -n myappsmith | grep NodePort:
```
