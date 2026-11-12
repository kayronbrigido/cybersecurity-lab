# **Cybersecurity Lab — IDOR and Broken Object Level Authorization (BOLA) in REST APIs**
**Level:** Intermediate <br>
**Environment:** Linux + Docker + Node.js <br>
**Focus:** Authentication, authorization, API security, and secure development

In this lab, we will explore a category of vulnerability that warrants special attention in banking systems, marketplaces, and SaaS applications: unauthorized access to resources belonging to other users or companies.

Instead of simply running a scan with OWASP ZAP, we will build an intentionally vulnerable API, reproduce the issue using `curl`, and implement a fix.

This approach also aligns the exercise with real-world scenarios you might encounter when developing APIs using NestJS or working with multi-tenant systems.

## **STARTING PROJECT**

To start the project, you must first build the project image in Docker.
``` sh
docker compose up -d --build
```

After running it, verify that the image is up and running.
``` sh
docker compose ps
```

Next, make a request to the API to confirm that it is working.
``` sh
curl -i http://127.0.0.1:8080/health
```

The expected response should be:
``` sh
HTTP/1.1 200 OK
Content-Type: application/json
{"status":"ok"}
```

## **Authentication Test**

Define the users Token:
``` sh
ALICE_TOKEN="alice-lab-token"
BOB_TOKEN="bob-lab-token"
```

Test request withou authentication
``` sh
curl -i http://127.0.0.1:8080/api/invoices/INV-1001
```
The expected response should be:
``` sh
HTTP/1.1 200 OK
Content-Type: application/json
{"error":"Unauthorized"}
```
This show that authentication works, now we can test with a Bearar token header with the curl
``` sh
curl -i -H "Authorization: Bearer $ALICE_TOKEN" http://127.0.0.1:8080/api/me
```

the body response should be:
``` json
{"user":
  {
    "id":"user-100",
    "name":"Alice"
  }
}
```

Change the ALICE_TOKEN to BOB_TOKEN and the response change to Bob data

## **IDOR**

Alice can access your own invoices
``` sh
curl -i \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  http://127.0.0.1:8080/api/invoices/INV-1001
```

Response body:
``` json
{
  "invoice": {
    "id": "INV-1001",
    "ownerId": "user-100",
    "description": "Fatura de Alice",
    "amount": 150
  }
}
```

Bob can also access his own invoice, however, the application lacks validation, which allows Alice to access Bob's invoice by changing the invoice number.

``` sh
curl -i \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  http://127.0.0.1:8080/api/invoices/INV-2001
```

Response body: 
``` json
{
  "invoice": {
    "id": "INV-2001",
    "ownerId": "user-200",
    "description": "Fatura de Bob",
    "amount": 900
  }
}
```

The issue does not lie with authentication, rather, it stems from the absence of an authorization check for the requested object.

# **What does this mean in a real-world application?**

Consider an API for a financial system:
``` sh
GET /api/accounts/123456/transactions
```
If the application only validates whether a user is authenticated—without verifying whether they have access to account 123456—it could expose the financial information of other clients.

In a multi-tenant marketplace, the scenario might look like this:
``` sh
GET /api/companies/1001/orders
```

If the API fails to validate the user's association with the company, a client could potentially access orders belonging to another organization.

This is precisely the type of problem that can compromise tenant isolation.

## **Fixing the vulnerability**

Now we will enable ownership verification.

``` sh
ENFORCE_OWNERSHIP=true \
docker compose up -d --build --force-recreate
```

Check the logs.
``` sh
docker compose logs api
```

You should see something similar to:
``` sh
idor-api-lab  | API running on port 3000
idor-api-lab  | Ownership enforcement: true
```

# **Repete the tests.**

Alice access the own invoice:
``` sh
curl -i \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  http://127.0.0.1:8080/api/invoices/INV-1001
```

Alice try access Bob invoice
``` sh
curl -i \
  -H "Authorization: Bearer $ALICE_TOKEN" \
  http://127.0.0.1:8080/api/invoices/INV-2001
```

But now the response should be HTTP response 404 and response body should be:

``` json
{"error":"Invoice not found"}
```

## **Automating tests**

Now that the fix has been implemented, you can run a test using the script **security-test.sh**

Allow execution:
``` sh
chmod +x security-test.sh
```
Execute:
```sh
./security-test.sh
```
With the fix enabled, the expected result is:
```
[PASS] Alice acessa sua fatura
[PASS] Bob acessa sua fatura
[PASS] Alice não acessa fatura de Bob
[PASS] Bob não acessa fatura de Alice
```
Now, temporarily disable the fix:

``` sh
ENFORCE_OWNERSHIP=false \
docker compose up -d --force-recreate
```
Run the script again.

Both cross-access tests should fail, demonstrating that the suite is capable of detecting the security regression.

This is a simple example of how to incorporate authorization tests into a CI/CD pipeline.

## **Cleanup:**

Remove the environment when finished:
``` sh
docker compose down
```
If you also wish to remove the image built for the lab:
``` sh
docker compose down --rmi local
```
There is no need to run `docker system prune`.