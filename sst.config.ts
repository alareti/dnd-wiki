import { SSTConfig } from "sst";
import { FrontendStack } from "./stacks/FrontendStack";

export default {
  config(_input) {
    return {
      name: "dnd-wiki",
      region: "us-east-2",
      profile: "admin",
    };
  },
  stacks(app) {
    app.stack(FrontendStack);
  },
} satisfies SSTConfig;
