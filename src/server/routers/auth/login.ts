import { procedure } from "../../trpc";
import { generators } from "openid-client";
import { authorize } from "@/server/services/authorize";
import { DynamoDB } from "aws-sdk";

export const login = procedure.mutation(async ({ ctx }) => {
  const docClient = new DynamoDB.DocumentClient({ region: "ap-northeast-1" });
  const tableName = "twitter-management";

  const putParams = {
    TableName: tableName,
    Item: {
      id: "123",
      name: "sample name",
    },
  };

  docClient.put(putParams, function (err, data) {
    if (err) {
      console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log("Added item:", JSON.stringify(data, null, 2));
    }
  });

  const state = generators.state();
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);

  const { authorizeURL } = authorize({ state, codeChallenge });

  ctx.session.state = state;
  ctx.session.codeVerifier = codeVerifier;
  await ctx.session.save();

  return { authorizeURL };
});
