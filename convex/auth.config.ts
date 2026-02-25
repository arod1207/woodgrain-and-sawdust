const domain = process.env.CLERK_JWT_ISSUER_DOMAIN;
if (!domain) {
  throw new Error(
    "CLERK_JWT_ISSUER_DOMAIN is not set in the Convex environment. " +
      "Run: npx convex env set CLERK_JWT_ISSUER_DOMAIN <your-clerk-issuer-url>"
  );
}

export default {
  providers: [
    {
      domain,
      applicationID: "convex",
    },
  ],
};
