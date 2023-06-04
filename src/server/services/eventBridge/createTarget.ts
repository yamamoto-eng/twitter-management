import { LambdaEvent } from "@/types/lambdaEvent";
import { ebClient } from "@/libs";
import { PutTargetsCommand } from "@aws-sdk/client-eventbridge";

type Args = {
  ebId: string;
  arn: string;
  event: LambdaEvent;
};

export const createTarget = (args: Args) => {
  const { ebId, arn, event } = args;

  const putTargetsCommand = new PutTargetsCommand({
    Rule: ebId,
    Targets: [
      {
        Arn: arn,
        Id: ebId,
        Input: JSON.stringify(event),
      },
    ],
  });

  return ebClient.send(putTargetsCommand);
};
