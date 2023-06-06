import { ebClient } from "@/libs";
import { PutRuleCommand } from "@aws-sdk/client-eventbridge";
import dayjs from "dayjs";

type Args = {
  ebId: string;
  date?: dayjs.Dayjs;
  isEnabled?: boolean;
};

export const updateRule = (args: Args) => {
  const { ebId, date, isEnabled } = args;

  const getScheduleExpression = () => {
    if (date === undefined) return undefined;
    const utcDate = date.utc();
    return `cron(${utcDate.minute()} ${utcDate.hour()} ? * ${utcDate.day() + 1} *)`;
  };

  const getState = () => {
    if (isEnabled === undefined) return undefined;
    return isEnabled ? "ENABLED" : "DISABLED";
  };

  const putRuleCommand = new PutRuleCommand({
    Name: ebId,
    ScheduleExpression: getScheduleExpression(),
    State: getState(),
  });

  return ebClient.send(putRuleCommand);
};
