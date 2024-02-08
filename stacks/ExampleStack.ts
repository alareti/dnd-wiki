import {
  StackContext,
  SvelteKitSite,
  Table,
  Api,
  Auth,
  Config,
} from "sst/constructs";

export function ExampleStack({ stack, app }: StackContext) {
  // Define custom domain name
  const domain = "alareti.com";
  const stage = app.stage;
  const DOMAIN_NAME = new Config.Parameter(stack, "DOMAIN_NAME", {
    value: domain,
  });

  const apiDomain = `${stage}-api.${domain}`;

  // Create a database Table
  const table = new Table(stack, "users", {
    fields: {
      userId: "string",
    },
    primaryIndex: { partitionKey: "userId" },
  });

  // Create Api
  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [table],
      },
    },
    customDomain: apiDomain,
    routes: {
      "GET /session": "packages/functions/src/session.handler",
    },
    cors: {
      allowOrigins:
        stage == "prod"
          ? [`https://${domain}`, `https://www.${domain}`]
          : ["*"],
      allowHeaders: ["Content-Type", "Authorization"],
      allowCredentials: stage == "prod" ? true : false,
    },
  });

  const site = new SvelteKitSite(stack, "SvelteSite", {
    path: "frontend/",
    environment: {
      PUBLIC_API_URL: api.url,
    },
    customDomain: {
      domainName: domain,
      domainAlias: `www.${domain}`,
    },
  });

  // Create Auth provider
  const auth = new Auth(stack, "auth", {
    authenticator: {
      handler: "packages/functions/src/auth.handler",
      bind: [site],
    },
  });
  auth.attach(stack, {
    api,
    prefix: "/auth",
  });

  // Add the site's URL to stack output
  stack.addOutputs({
    ApiEndpoint: api.url,
    ApiCustomUrl: api.customDomainUrl,
    SiteEndpoint: site.url,
    SiteCustomUrl: site.customDomainUrl,
  });
}
