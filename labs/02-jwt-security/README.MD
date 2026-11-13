# **Exploiting Vulnerabilities in JSON Web Tokens**
**Track**: API Security · Authentication · Authorization <br>
**Prerequisites:**
- Node.js 20 or higher.
- npm.
- PowerShell (on Windows).
- A local terminal.

In this lab, we will investigate how an improper JWT implementation can allow a regular user to gain administrative privileges.

The exercise will be conducted on a local Node.js API, without relying on Docker. This also allows you to make progress while you sort out your Docker Desktop configuration on Windows.

## **1. Objectives**
Upon completing this lab, you should be able to:
- Understand the structure of a JWT.
- Identify what information can be viewed without knowing the secret key.
- Understand how a weak key can compromise the signature.
- Demonstrate the forging of a token in a controlled environment.
- Implement measures to secure authentication and authorization.

## **2. Key concepts**
A JWT (JSON Web Token) is a format used to transmit information between parties, typically within authentication mechanisms.

Its structure consists of three parts:

- Header: the algorithm and the type of token.
- Payload: information such as the user, permissions, and expiration.
- Signature: a signature that allows for the verification of the token's integrity and authenticity.

Example:
``` json
{
  "sub": "user-123",
  "name": "Maria",
  "role": "user",
  "iat": 1794500000
}
```

An important detail: the payload of a JWT signed with HS256 is not encrypted. Anyone who possesses the token can decode it and view its contents.

This does not mean that they can freely alter the data: the signature must be validated.

## **3. Lab Scenario**
Imagine an API that has two types of users:
- User	Permission
- Maria	user
- Admin	admin

The application issues JWT tokens to authenticate users.

The problem: the developer used a weak secret key (secret123), and the application trusts the permissions contained within the token once its signature has been validated.

If someone discovers this key, they can create a token with different privileges.
Vulnerability Flow
1. A user logs in and receives a legitimate JWT.
2. The token is decoded to view its payload.
3. A weak secret key is discovered within the lab environment.
4. The token is re-signed with the role: admin.
5. The API accepts the forged token and grants administrative access.

## **4. Obtaining a JWT**

Install dependecies and start application

``` sh
npm install
node app.js
```

Open another terminal and log in as Alice:
``` sh
LOGIN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice"}')

TOKEN=$(node -p "JSON.parse(process.argv[1]).token" "$LOGIN")

echo $TOKEN
```

Now try access the profile

``` sh
curl -i "http://127.0.0.1:3000/profile" \
  -H "Authorization: Bearer $TOKEN"
```

## **5. Inspecting the token**

Now, let’s examine the contents of the JWT.

You can use the [jwt.io Debugger](https://www.jwt.io/) to understand how the Header, Payload, and Signature are organized.

Caution: Use only dummy tokens or those provided for this lab. Never paste real production tokens into external tools.

Observe the following fields:
- sub: user identifier.
- name: name.
- role: permission.
- iat: issued-at time.
- exp: expiration time.
An important question: if you change the `role` from `user` to `admin`, will the token remain valid?

No. The signature will no longer match the content.

## **6. Demonstrating forgery**
Now, let’s simulate what happens when someone discovers the weak secret key used by the application.

``` sh
FORGED_TOKEN=$(node ./forge.js $TOKEN)

echo $FORGED_TOKEN
```

If you attempt to access the /admin endpoint, access is blocked due to a lack of permission.
``` sh
curl -i "http://127.0.0.1:3000/admin" \
  -H "Authorization: Bearer $TOKEN"
```

but after executing the forge.js script and storing the tampered token, FORGED_TOKEN, you will be able to attempt access

``` sh
curl -i "http://127.0.0.1:3000/admin" \
  -H "Authorization: Bearer $FORGED_TOKEN"
```

What happened?
1. The original token was legitimately issued to Alice.
2. The weak key was assumed to be known to the attacker.
3. A new JWT was created with `role: admin`.
4. The signature was calculated using the discovered key.
5. The API accepted the token because its signature was valid.
Important: This is not an inherent flaw in JWT; it is a secret management failure. The attack relies on the attacker being able to discover the key or obtain it through some other means.

## **8. Fixing the vulnerability**

Let’s fix the issue by replacing the weak key with a strong, random key.

First, generate a cryptographically secure key:
``` sh
CRYPTO_KEY=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

JWT_SECRET="$CRYPTO_KEY" node app.js
```

Open another terminal and try login again:
``` sh
LOGIN=$(curl -s -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice"}')

TOKEN=$(node -p "JSON.parse(process.argv[1]).token" "$LOGIN")

echo $TOKEN
```

You should be able to log in without any issues. Run the forge script:
``` sh
FORGED_TOKEN=$(node ./forge.js $TOKEN)

echo $FORGED_TOKEN
```

and access the /admin endpoint

``` sh
curl -i "http://127.0.0.1:3000/admin" \
  -H "Authorization: Bearer $FORGED_TOKEN"
```

The signature is no longer valid because the attacker in our scenario only knows the old key. <br>
Other protection measures <br>
| Measure |	Objective |
| ------- | --------- |
| Strong, random keys |	Make it difficult to discover the key |
| Environment variables or Secrets Manager | Avoid hardcoding secrets
| expiresIn	| Limit the token's lifespan
| Allowed algorithms	| Prevent the acceptance of unexpected algorithms
| Issuer and audience	| Restrict the token's origin and intended recipient
| Key rotation	| Reduce the impact of a compromised key
| Backend authorization	| Ensure the user has permission for each operation

In the AWS ecosystem, for example, you can manage secrets using AWS Secrets Manager.

For larger applications, it is also worth looking into RS256 or ES256, where the signature uses a private key and validation can be performed using a public key.

**An important note for multi-tenant applications:** verifying that a JWT is valid is not enough. You must also ensure that the user has access to the requested tenant, company, and resource. This directly links this exercise to the previous lab on IDOR/BOLA.