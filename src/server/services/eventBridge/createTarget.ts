import { LambdaEvent } from "@/types/lambdaEvent";
import { ebClient } from "@/libs";
import { PutTargetsCommand } from "@aws-sdk/client-eventbridge";

type Args = {
  id: string;
  arn: string;
  event: LambdaEvent;
};

export const createTarget = (args: Args) => {
  const { id, arn, event } = args;

  const putTargetsCommand = new PutTargetsCommand({
    Rule: id,
    Targets: [
      {
        Arn: arn,
        Id: id,
        Input: JSON.stringify(event),
      },
    ],
  });

  return ebClient.send(putTargetsCommand);
};
