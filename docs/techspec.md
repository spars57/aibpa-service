# Tecnical Specification for AIBPA Service (v.1.0.0)

## Authentication

The authentication of the application is done using JWT (Json Web Token).

In order to access restricted endpoints, the client must have a valid user and perform login.

The login will return the access token whose purpose will be to validate authentication on every request. This token must be sent on the header of every request using the following structure.

```typescript
    const headers = {
        "Authorization": `Bearer {{accessToken}}`
        ...otherHeaders
    }
```

This token will contain all the information regarding the user
