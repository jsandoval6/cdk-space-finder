import { DynamoDBClient, GetItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getSpaces ( event: APIGatewayProxyEvent, ddbClient: DynamoDBClient ): Promise<APIGatewayProxyResult> {
    
    if ( event.queryStringParameters) {
        if ( 'id' in event.queryStringParameters ) {
            const spaceId = event.queryStringParameters[ 'id' ];
            const getItemResponse = await ddbClient.send( new GetItemCommand( {
                TableName: process.env.TABLE_NAME,
                Key: {
                    "id": { S: spaceId! },
                    "DataStack": { S: 'spaceTable' }
                }
            } ) )
            
            if ( getItemResponse.Item )
            {
                const unmarshalledItem = unmarshall(getItemResponse.Item);
                return {
                    statusCode: 200,
                    body: JSON.stringify(unmarshalledItem)
                }
            }

            else {
                return {
                    statusCode: 404,
                    body: JSON.stringify( { message: `Space with id ${ spaceId } not found` } )
                }
            }
        }

        else
        {
            return {
                statusCode: 400,
                body: JSON.stringify( {
                    message: 'Missing id'
                } )
            }
        }
    }

    const result = await ddbClient.send( new ScanCommand( {
        TableName: process.env.TABLE_NAME
    } ) );

    const unmarshallItems = result.Items?.map( item => unmarshall( item ) );
    
    return {
        statusCode: 200,
        body: JSON.stringify(unmarshallItems)
    }
    
}