# This is Front Client

## Step1. Setup Environment settings

1. Check if node version >= v12.16.3

```
> node --verison
v12.16.3
```

2. Install yarn by npm

```
> npm install -g yarn
> yarn --version
1.22.10
```

3. Install dependencies from package.json

```
> yarn install
```

3. Run for development mode (on windows10 or OSX)
   - Win10: yarn dev-win
   - OSX: yarn dev-mac

```
> yarn dev-win
set PORT=3023 && react-scripts start
```

## (On-Premise Installation)

4. Check if petweb-back and petweb-api running on 8023 port on localhost

### **WARNING**:

    Server IP (IPinUSE) must be set to "http://localhost:8023/"

    IPinUSE can be found on the path "PETWEB-FRONT/src/services/IPs.js"
