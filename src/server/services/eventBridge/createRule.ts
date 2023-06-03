import { ebClient } from "@/libs";
import { PutRuleCommand } from "@aws-sdk/client-eventbridge";
import dayjs from "dayjs";

type Args = {
  id: string;
  date: dayjs.Dayjs;
};

export const createRule = (args: Args) => {
  const { id, date } = args;

  const utcDate = date.utc();

  const putRuleCommand = new PutRuleCommand({
    Name: id,
    ScheduleExpression: `cron(${utcDate.minute()} ${utcDate.hour()} ? * ${utcDate.day() + 1} *)`,
  });

  return ebClient.send(putRuleCommand);
};
