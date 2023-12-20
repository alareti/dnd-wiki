import { StackContext, SvelteKitSite } from "sst/constructs";

export function FrontendStack({ stack }: StackContext) {
  const site = new SvelteKitSite(stack, "SvelteKitSite", {
    path: "frontend",
  });

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: site.url,
  });
}
