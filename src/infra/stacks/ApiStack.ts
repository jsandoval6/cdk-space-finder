import { Stack, StackProps } from "aws-cdk-lib";
import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps {
    spacesLambdaIntegration: LambdaIntegration,
    userPool: IUserPool
}

export class ApiStack extends Stack {
    
    constructor ( scope: Construct, id: string, props: ApiStackProps ) {
        super( scope, id, props );

        const api = new RestApi( this, "SpacesApi" );

        const authorizer = new CognitoUserPoolsAuthorizer( this, 'spaceAuthorizer', {
            cognitoUserPools: [ props.userPool ],
            identitySource: 'method.request.header.Authorization'
        } );

        authorizer._attachToApi( api );

        const optionsWithAuths: MethodOptions = {
            authorizationType: AuthorizationType.COGNITO,
            authorizer: {
                authorizerId: authorizer.authorizerId
            }
        }

        const spacesResource = api.root.addResource( 'spaces' );
        spacesResource.addMethod( 'GET', props.spacesLambdaIntegration, optionsWithAuths );
        spacesResource.addMethod( 'POST', props.spacesLambdaIntegration, optionsWithAuths);
        spacesResource.addMethod( 'PUT', props.spacesLambdaIntegration, optionsWithAuths );
        spacesResource.addMethod('DELETE', props.spacesLambdaIntegration, optionsWithAuths);
    }
}