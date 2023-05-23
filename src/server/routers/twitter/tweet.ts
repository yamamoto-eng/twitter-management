import { procedure } from "@/server/trpc";
import { z } from "zod";
import { twitterApiV2 } from "@/server/services/twitterApiV2";
import { DynamoDB } from "aws-sdk";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "@/server/db/ddbClient";

export const tweet = procedure
  .input(
    z.object({
      text: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const docClient = new DynamoDB.DocumentClient({
      accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY,
      region: "ap-northeast-1",
    });
    const tableName = "twitter-management";

    // const putParams = {
    //   TableName: tableName,
    //   Item: {
    //     id: "123",
    //     name: "v2",
    //     date: new Date().toLocaleString(),
    //   },
    // };

    const params = {
      TableName: "twitter-management",
      Item: {
        id: { S: "124" },
        name: { S: "v3" },
        date: { S: new Date().toLocaleString() },
      },
    };

    try {
      await ddbClient.send(new PutItemCommand(params));
      // await docClient.put(putParams);

      // await twitterApiV2(ctx, (client) => client.tweets.createTweet(input));

      return { success: true };
    } catch {
      return { success: false };
    }
  });
