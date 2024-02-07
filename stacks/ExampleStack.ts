import { StackContext, SvelteKitSite, Table, Api, Auth } from "sst/constructs";

export function ExampleStack({ stack }: StackContext) {
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
    routes: {
      "GET /session": "packages/functions/src/session.handler",
    },
  });

  const site = new SvelteKitSite(stack, "SvelteSite", {
    path: "frontend/",
    environment: {
      PUBLIC_API_URL: api.url,
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
    URL: site.url,
  });
}
