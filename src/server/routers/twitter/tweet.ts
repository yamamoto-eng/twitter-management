import { procedure } from "@/server/trpc";
import { z } from "zod";
import { twitterApiV2 } from "@/server/services/twitterApiV2";
import { DynamoDB } from "aws-sdk";

export const tweet = procedure
  .input(
    z.object({
      text: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const docClient = new DynamoDB.DocumentClient({ region: "ap-northeast-1" });
    const tableName = "twitter-management";

    const putParams = {
      TableName: tableName,
      Item: {
        id: "123",
        name: "sample name",
      },
    };

    let error = undefined;
    try {
      await docClient.put(putParams, function (err, data) {
        if (err) {
          error = err;
        } else {
        }
      });
      // await twitterApiV2(ctx, (client) => client.tweets.createTweet(input));

      return { success: true, token: process.env?.AWS_ACCESS_KEY_ID, error: error };
    } catch {
      return { success: false, token: process.env?.AWS_ACCESS_KEY_ID, error: error };
    }
  });
