import { stringify } from "query-string";

// Static oidc params for a single provider
const authority = "https://preprod.login.w3.ibm.com/oidc/endpoint/default/authorize"; //Change this depending on the environment you're using
const client_id = "Your client ID";
const redirect_uri = "https://localhost:3000/auth";
const response_type = "id_token token";
const scope = "openid";

export const beginAuth = ({ state, nonce }) => {
  // Generate authentication URL
  const params = stringify({
    client_id,
    redirect_uri,
    response_type,
    scope,
    state,
    nonce
  });
  const authUrl = `${authority}?${params}`;
  console.log(authUrl);

  // Attempt login by navigating to authUrl
  window.location.assign(authUrl);
};
