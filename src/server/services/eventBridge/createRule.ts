import { ebClient } from "@/libs";
import { DayOfWeek, Time } from "@/schema/dateTime";
import { PutRuleCommand } from "@aws-sdk/client-eventbridge";

type Args = {
  id: string;
  time: Time;
  dayOfWeek: DayOfWeek;
};

export const createRule = (args: Args) => {
  const { id, time, dayOfWeek } = args;

  const putRuleCommand = new PutRuleCommand({
    Name: id,
    ScheduleExpression: `cron(${time.min} ${time.hour} ? * ${dayOfWeek} *)`,
  });

  return ebClient.send(putRuleCommand);
};
