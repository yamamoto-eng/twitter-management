import { procedure } from "../../trpc";
import { scheduledTweetRepository } from "@/server/db";
import { createRule, createTarget } from "@/server/services/eventBridge";
import { v4 } from "uuid";
import { input, output } from "@/schema/scheduledTweet/create";
import { getArn } from "@/server/services/lambda/getArn";
import { AWS_CONFIG } from "@/constants";
import { TweetLambdaEvent } from "@/types/lambdaEvent";
import dayjs from "dayjs";
import { createRandomDateInRange } from "@/utils";
import { createNextDateForTime } from "@/utils/createNextDateForTime";

export const create = procedure
  .input(input)
  .output(output)
  .mutation(async ({ ctx, input }) => {
    const uuid = v4();

    const { fromDate, toDate } = createNextDateForTime(dayjs(input.fromTime), dayjs(input.toTime), input.interval);
    const { date } = createRandomDateInRange(fromDate, toDate);

    const { save } = scheduledTweetRepository(ctx.session.id);

    const { arn } = await getArn({ functionName: AWS_CONFIG.LAMBDA_FUNCTION_NAME.TWEET });

    if (!arn) {
      throw new Error("ARN not found");
    }

    const event: TweetLambdaEvent = {
      id: ctx.session.id,
      ebId: uuid,
    };

    await createRule({ ebId: uuid, date, isEnabled: input.isEnabled });
    await createTarget({ ebId: uuid, event, arn: arn });

    const scheduledTweet = await save({
      id: ctx.session.id,
      ebId: uuid,
      text: input.text,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      isEnabled: input.isEnabled,
      interval: input.interval,
      scheduledDeletionDay: input.scheduledDeletionDay,
    });

    if (!scheduledTweet) {
      throw new Error("Failed to save scheduled tweet");
    }

    return {
      scheduledTweet: {
        ...scheduledTweet,
        fromDate: dayjs(scheduledTweet.fromDate).toDate(),
        toDate: dayjs(scheduledTweet.toDate).toDate(),
        createdAt: dayjs(scheduledTweet.createdAt).toDate(),
      },
    };
  });
