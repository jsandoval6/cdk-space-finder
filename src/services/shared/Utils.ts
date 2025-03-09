import { JSONError } from "@/services/shared/DataValidator"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

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

export function addCORSHeader ( arg: APIGatewayProxyResult ){ 
    if ( !arg.headers ) {
        arg.headers = {};
    }
    arg.headers[ 'Access-Control-Allow-Origin' ] = '*';
     arg.headers[ 'Access-Control-Allow-Methods' ] = '*';
}