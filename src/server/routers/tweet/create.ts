import { procedure } from "../../trpc";
import { tweetRepository } from "@/server/db";
import { createRule, createTarget } from "@/server/services/eventBridge";
import { v4 } from "uuid";
import { input, output } from "@/schema/tweet/create";
import { getArn } from "@/server/services/lambda/getArn";
import { AWS_CONFIG } from "@/constants";
import { TweetLambdaEvent } from "@/types/lambdaEvent";
import dayjs from "dayjs";
import { createRandomDateInRange } from "@/utils";
import { Interval } from "@/schema/dateTime";

export const create = procedure
  .input(input)
  .output(output)
  .mutation(async ({ ctx, input }) => {
    const uuid = v4();

    const { fromDate, toDate } = createDate(dayjs(input.fromTime), dayjs(input.toTime), input.interval);
    const { date } = createRandomDateInRange(fromDate, toDate);

    const { addTweet } = tweetRepository(ctx.session.id);

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

    const tweet = {
      ebId: uuid,
      text: input.text,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      isEnabled: input.isEnabled,
      interval: input.interval,
    };

    await addTweet(tweet);

    return {
      tweet: {
        ...tweet,
        fromDate: dayjs(tweet.fromDate).toDate(),
        toDate: dayjs(tweet.toDate).toDate(),
      },
    };
  });

const createDate = (fromTime: dayjs.Dayjs, toTime: dayjs.Dayjs, interval: Interval) => {
  const now = dayjs();
  const fromHour = fromTime.hour();
  const fromMinute = fromTime.minute();
  const toHour = toTime.hour();
  const toMinute = toTime.minute();

  let fromDate = now;
  let toDate = now;

  if (interval.type === "day") {
    fromDate = now.hour(fromHour).minute(fromMinute).add(interval.day, "d");
    toDate = now.hour(toHour).minute(toMinute).add(interval.day, "d");
  }

  if (interval.type === "dayOfWeek") {
    fromDate = now.hour(fromHour).minute(fromMinute).day(interval.dayOfWeek);
    toDate = now.hour(toHour).minute(toMinute).day(interval.dayOfWeek);
  }

  if (fromDate.isAfter(toDate)) {
    toDate = toDate.add(1, "d");
  }

  return { fromDate, toDate };
};
