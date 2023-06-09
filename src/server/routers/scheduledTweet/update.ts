import { procedure } from "../../trpc";
import { scheduledTweetRepository } from "@/server/db";
import dayjs from "dayjs";
import { createTarget, updateRule } from "@/server/services/eventBridge";
import { input, output } from "@/schema/scheduledTweet/update";
import { createNextDateForTime } from "@/utils/createNextDateForTime";
import { createRandomDateInRange } from "@/utils";
import { AWS_CONFIG } from "@/constants";
import { getArn } from "@/server/services/lambda/getArn";
import { TweetLambdaEvent } from "@/types/lambdaEvent";

export const update = procedure
  .input(input)
  .output(output)
  .mutation(async ({ ctx, input }) => {
    const { save } = scheduledTweetRepository(ctx.session.id);

    const { fromDate, toDate } = createNextDateForTime(dayjs(input.fromTime), dayjs(input.toTime), input.interval);
    const { date } = createRandomDateInRange(fromDate, toDate);

    const { arn } = await getArn({ functionName: AWS_CONFIG.LAMBDA_FUNCTION_NAME.TWEET });

    if (!arn) {
      throw new Error("ARN not found");
    }

    const event: TweetLambdaEvent = {
      id: ctx.session.id,
      ebId: input.ebId,
    };

    await createTarget({ arn, ebId: input.ebId, event });
    await updateRule({ ebId: input.ebId, date, isEnabled: input.isEnabled });

    const scheduledTweet = await save({
      id: ctx.session.id,
      ebId: input.ebId,
      text: input.text,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      interval: input.interval,
      isEnabled: input.isEnabled,
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
