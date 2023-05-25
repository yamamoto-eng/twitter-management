import { twitterConfig } from "@/constants";

type Props = {
  state: string;
  codeChallenge: string;
};

export const authorize = ({ state, codeChallenge }: Props) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: twitterConfig.clientId,
    redirect_uri: twitterConfig.redirectUri,
    scope: "tweet.read users.read tweet.write offline.access",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "s256",
  });

  const authorizeURL = `https://twitter.com/i/oauth2/authorize?${params}`;

  return { authorizeURL };
};
