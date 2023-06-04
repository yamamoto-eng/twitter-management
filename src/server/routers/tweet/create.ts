import { procedure } from "../../trpc";
import { tweetRepository } from "@/server/db";
import { createTarget } from "@/server/services/eventBridge/createTarget";
import { v4 } from "uuid";
import { createRule } from "@/server/services/eventBridge/createRule";
import { input, output } from "@/schema/tweet/create";
import { getArn } from "@/server/services/lambda/getArn";
import { AWS_CONFIG } from "@/constants";
import { TweetLambdaEvent } from "@/types/lambdaEvent";
import dayjs from "dayjs";
import { createRandomDateInRange } from "@/utils";

export const create = procedure
  .input(input)
  .output(output)
  .mutation(async ({ ctx, input }) => {
    const uuid = v4();
    const { addTweet } = tweetRepository();
    const { date } = createRandomDateInRange(dayjs(input.fromDate), dayjs(input.toDate));

    const { arn } = await getArn({ functionName: AWS_CONFIG.LAMBDA_FUNCTION_NAME.TWEET });

    if (!arn) {
      throw new Error("ARN not found");
    }

    const event: TweetLambdaEvent = {
      id: ctx.session.id,
      text: input.text,
    };

    await createRule({ id: uuid, date, isEnabled: input.isEnabled });
    await createTarget({ id: uuid, event, arn: arn });

    await addTweet({
      id: ctx.session.id,
      tweet: {
        ebId: uuid,
        text: input.text,
        fromDate: input.fromDate.toISOString(),
        toDate: input.toDate.toISOString(),
        isEnabled: input.isEnabled,
      },
    });

    return { date: date.toDate() };
  });
