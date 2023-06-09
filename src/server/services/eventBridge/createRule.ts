import { ebClient } from "@/libs";
import { PutRuleCommand } from "@aws-sdk/client-eventbridge";
import dayjs from "dayjs";

type Args = {
  ebId: string;
  date: dayjs.Dayjs;
  isEnabled: boolean;
};

export const createRule = (args: Args) => {
  const { ebId, date, isEnabled } = args;

  const utcDate = date.utc();
  const state = isEnabled ? "ENABLED" : "DISABLED";

  const putRuleCommand = new PutRuleCommand({
    Name: ebId,
    ScheduleExpression: `cron(${utcDate.minute()} ${utcDate.hour()} ${utcDate.date()} * ? *)`,
    State: state,
  });

  return ebClient.send(putRuleCommand);
};
