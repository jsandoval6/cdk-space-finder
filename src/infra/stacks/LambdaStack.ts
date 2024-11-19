import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Function as LambdaFunction, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface LambdaStackProps extends StackProps {
    spacesTable: ITable
}

export class LambdaStack extends Stack {
    
    public readonly helloLambdaIntegration: LambdaIntegration;
    
    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super( scope, id, props );
        
       const helloLambda =  new LambdaFunction( this, "HelloLambda", {
            runtime: Runtime.NODEJS_20_X,
            handler: "Hello.main",
            code: Code.fromAsset( join( __dirname, '..', '..', 'services' ) ),
            environment: {
                TABLE_NAME: props.spacesTable.tableName
            }
       } );
        
        this.helloLambdaIntegration = new LambdaIntegration( helloLambda );
    }  
}