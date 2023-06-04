import { ddbDocClient } from "../../libs";
import { AWS_CONFIG } from "@/constants";
import { Credentials, Tweet } from "@/models";

export const tweetRepository = () => {
  const addTweet = ({ id, tweet }: { id: Credentials["id"]; tweet: Tweet }) => {
    return ddbDocClient.update({
      TableName: AWS_CONFIG.TABLE_NAME,
      Key: {
        id,
      },
      UpdateExpression: "SET #tl = list_append(if_not_exists(#tl, :empty), :t)",
      ExpressionAttributeNames: {
        "#tl": "tweetList",
      },
      ExpressionAttributeValues: {
        ":t": [tweet],
        ":empty": [],
      },
    });
  };

  return {
    addTweet,
  };
};

// UpdateExpression: "set #list = list_append(#list, :newItem)"

// UpdateExpression: "set #l = list_append(#l, :newItem)", // list属性に新しいアイテムを追加
// ExpressionAttributeNames: {
//   "#l": "list", // 更新する属性の名前
// },
// ExpressionAttributeValues: {
//   ":newItem": [
//     {
//       id: "ITEM_ID",
//       date: (new Date()).toISOString(), // 日付をISO形式の文字列に変換
//       isEnabled: true // あるいはfalse
//     },
//     // 必要に応じて他の要素を追加
//   ], // 追加する新しいアイテム
// },
