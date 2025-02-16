import { JSONError } from "@/services/shared/DataValidator"
import { APIGatewayProxyEvent } from "aws-lambda"

export function parseJSON ( args: any ) {
    try {
        return JSON.parse(args)
    } catch(error) {
        throw new JSONError('Invalid JSON')
    }
}

export function hasAdminGroup ( event: APIGatewayProxyEvent ): boolean {
    const groups = event.requestContext.authorizer.claims[ 'cognito:groups' ];
    if ( groups ) {
        return ( groups as string ).includes( 'admins' );
    }
    return false;
}