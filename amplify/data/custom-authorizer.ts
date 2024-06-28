// amplify/data/custom-authorizer.ts

// This is sample code. Update this to suite your needs
import type { AppSyncAuthorizerHandler } from 'aws-lambda'; // types imported from @types/aws-lambda
import fetch from 'node-fetch';

interface ApiResponse {
  verified: boolean;
}

const url = 'https://concordbus2-dev.vetrackr.com/oauth/verify';

const verifyToken = async (token:String): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token
      })
    });

    if (!response.ok) {
      // throw new Error(`HTTP error! status: ${response.status}`);
      return false;
    }

    const data: ApiResponse = await response.json() as ApiResponse;
    console.log('Response:', data);
    return data.verified;

  } catch (error) {
    console.error('Error:', error);
    return false;
  }
};

type ResolverContext = {
  // userid: string;
  // info: string;
  // more_info: string;
};

export const handler: AppSyncAuthorizerHandler<ResolverContext> = async (
  event
) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  const {
    authorizationToken,
    requestContext: { apiId, accountId }
  } = event;

  const verified = await verifyToken(authorizationToken);
  const response = {
    isAuthorized: verified,  //authorizationToken === 'test-token123',
    resolverContext: {
      // eslint-disable-next-line spellcheck/spell-checker
      // userid: 'user-id',
      // info: 'contextual information A',
      // more_info: 'contextual information B'
    },
    deniedFields: [
      `arn:aws:appsync:${process.env.AWS_REGION}:${accountId}:apis/${apiId}/types/Event/fields/comments`,
      `Mutation.createEvent`
    ],
    ttlOverride: 3600
  };
  console.log(`RESPONSE: ${JSON.stringify(response, null, 2)}`);
  return response;
};