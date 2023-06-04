import { ebClient } from "@/libs";
import { RemoveTargetsCommand } from "@aws-sdk/client-eventbridge";

type Args = {
  ebId: string;
};

export const deleteTarget = (args: Args) => {
  const { ebId } = args;

  const putTargetsCommand = new RemoveTargetsCommand({
    Rule: ebId,
    Ids: [ebId],
  });

  return ebClient.send(putTargetsCommand);
};
