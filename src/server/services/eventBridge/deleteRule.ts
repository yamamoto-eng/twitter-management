import { ebClient } from "@/libs";
import { DeleteRuleCommand } from "@aws-sdk/client-eventbridge";

type Args = {
  ebId: string;
};

export const deleteRule = async (args: Args) => {
  const { ebId } = args;

  const deleteRuleCommand = new DeleteRuleCommand({
    Name: ebId,
  });

  return ebClient.send(deleteRuleCommand);
};
