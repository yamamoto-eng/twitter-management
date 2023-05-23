import { procedure } from "@/server/trpc";
import { z } from "zod";
import { twitterApiV2 } from "@/server/services/twitterApiV2";
import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { ddbClient } from "@/server/db/ddbClient";

export const tweet = procedure
  .input(
    z.object({
      text: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
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

      // await twitterApiV2(ctx, (client) => client.tweets.createTweet(input));

      return { success: true };
    } catch {
      return { success: false };
    }
  });
