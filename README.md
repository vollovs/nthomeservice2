# angularZ
This is a angularjs 1.x website framework

## Install
There are two steps to Install the website ( The framework itself is a sample website )

### Step 1. Install dependencies
Download and unzip the angularZ or use git clone to a local folder, for the following we will use c:\workspace\angularZ.
Then open a command line window, execute:
```
npm install
```

### Step 2. Generate RSA security keys
This step will generate RSA keys for secure website's login, sign up page.
Open a command line window, excecute:
```
npm genkey
```
You will find the C:\workspace\angularZ\server\rsa_1024_priv.pem was replaced by a new private key file, and C:\workspace\angularZ\openssl\rsa_1024_pub.pem was replaced by a new public key file.

Open C:\workspace\angularZ\openssl\rsa_1024_pub.pem by a notepad, and copy the whole content to C:\workspace\angularZ\app\scripts\config.js, replace existing 'pubKey' value:

```
var cfg = {
		apiUrl: 'api',
		sessionPrefix : 'angularZ',
		pubKey: 
`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDLYeL+kAAg2gto5H1Z5d8le7Yb
JCM3SQYDr5XRp6jB09XauXZ6g91GRZanPvt9vhm+y64mvug2Wi0n/yqhC0dRq5Jq 
5o7JSukGNxG7OjOkayxmvm8upUbmvA+ktMqSb2oGE1yo/db+mBrJaJMrYJA1C3F3
mIJsEsISDBd+FwP6lQIDAQAB
-----END PUBLIC KEY-----`
}
```
## Run

### Step 1. Start your mongodb server
Install mongodb server 2.4.x from https://docs.mongodb.org/getting-started/shell/tutorial/install-mongodb-on-windows/
Make sure the port number matches 'port' number in C:\workspace\angularZ\server\config.js

Open a command line window execute (replace <mymongodb_path> with your own mongodb path to save the database files): 
```
mongod --dbpath=c:\<mymongodb_path>
```

### Step 2. Start node.js server 
Open a command line window execute: 
```
cd c:\workspace\angularZ\server
node serv.js 
```

### Step 3. Browse the page
open a browser and input 'http://localhost:5003' and you will see the web page and you can then signup an 'admin' account to setup your web page.



## Details about the RSA security in angularZ
### Install security key pair

angularZ use rsa to secure password during http post, username and password is encrypted by public key, this mechanism can prevent 
expose password over the network. The following steps can help you setup your own rsa key.

#### Step 1. Create rsa public key and private key by using openssl

- Download Pre-compiled openssl-1.0.2g-x64_86-win64.zip from https://indy.fulgan.com/SSL/
- Extract files to c:\workspace\openssl
- Open a command line window, type
```
openssl genrsa -out rsa_1024_priv.pem 1024
```
This generates a private key in rsa_1024_priv.pem file, next generate public key by typing:
```
openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem
```
Now open rsa_1024_pub.pem copy whole content to scripts/config.js, use `` to include it to pubKey attribute.
So it looks like:
```
var cfg = {
		apiUrl: 'api',
		sessionPrefix : 'angularZ',
		pubKey: 
`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDLYeL+kAAg2gto5H1Z5d8le7Yb
JCM3SQYDr5XRp6jB09XauXZ6g91GRZanPvt9vhm+y64mvug2Wi0n/yqhC0dRq5Jq 
5o7JSukGNxG7OjOkayxmvm8upUbmvA+ktMqSb2oGE1yo/db+mBrJaJMrYJA1C3F3
mIJsEsISDBd+FwP6lQIDAQAB
-----END PUBLIC KEY-----`			
}
```
Then copy rsa_1024_priv.pem to angularZ/server folder
