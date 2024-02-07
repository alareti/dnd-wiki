import { AuthHandler, GoogleAdapter, Session } from "sst/node/auth";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { Table } from "sst/node/table";
import { SvelteKitSite } from "sst/node/site";

declare module "sst/node/auth" {
  export interface SessionTypes {
    user: {
      userID: string;
    };
  }
}

const GOOGLE_CLIENT_ID =
  "51674019161-hq8h1hjukcqj1hirnb1fcto4qcep78n4.apps.googleusercontent.com";

export const handler = AuthHandler({
  providers: {
    google: GoogleAdapter({
      mode: "oidc",
      clientID: GOOGLE_CLIENT_ID,
      onSuccess: async (tokenset) => {
        const claims = tokenset.claims();

        const ddb = new DynamoDBClient({});
        await ddb.send(
          new PutItemCommand({
            TableName: Table.users.tableName,
            Item: marshall({
              userId: claims.sub,
              email: claims.email,
              picture: claims.picture,
              name: claims.given_name,
            }),
          })
        );

        return Session.parameter({
          redirect: process.env.IS_LOCAL
            ? "http://localhost:5173"
            : SvelteKitSite.SvelteSite.url,
          type: "user",
          properties: {
            userID: claims.sub,
          },
        });
      },
    }),
  },
});
