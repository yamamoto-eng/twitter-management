import { ebClient } from "@/libs";
import { PutRuleCommand } from "@aws-sdk/client-eventbridge";
import dayjs from "dayjs";

type Args = {
  id: string;
  date: dayjs.Dayjs;
  isEnabled: boolean;
};

export const createRule = (args: Args) => {
  const { id, date, isEnabled } = args;

  const utcDate = date.utc();
  const state = isEnabled ? "ENABLED" : "DISABLED";

  const putRuleCommand = new PutRuleCommand({
    Name: id,
    ScheduleExpression: `cron(${utcDate.minute()} ${utcDate.hour()} ? * ${utcDate.day() + 1} *)`,
    State: state,
  });

  return ebClient.send(putRuleCommand);
};
