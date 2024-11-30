import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Function as LambdaFunction, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { join } from "path";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

interface LambdaStackProps extends StackProps {
    spacesTable: ITable
}

export class LambdaStack extends Stack {
    
    public readonly spacesLambdaIntegration: LambdaIntegration;
    
    constructor(scope: Construct, id: string, props: LambdaStackProps) {
        super( scope, id, props );
        
    //    const helloLambda =  new LambdaFunction( this, "HelloLambda", {
    //         runtime: Runtime.NODEJS_20_X,
    //         handler: "hello.main",
    //         code: Code.fromAsset( join( __dirname, '..', '..', 'services' ) ),
    //         environment: {
    //             TABLE_NAME: props.spacesTable.tableName
    //         }
        //    } );
        
        const spacesLambda = new NodejsFunction( this, "SpacesLamba", {
            runtime: Runtime.NODEJS_20_X,
            handler: "handler",
            entry: join( __dirname, '..', '..', 'services', 'spaces', 'handler.ts' ),
            environment: {
                TABLE_NAME: props.spacesTable.tableName
            },
        } );

        spacesLambda.addToRolePolicy( new PolicyStatement( {
            effect: Effect.ALLOW,
            resources: [ props.spacesTable.tableArn],
            actions: [
                'dynamodb:PutItem',
                'dynamodb:GetItem',
                'dynamodb:Scan',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem'
            ]
        }))
        
        // helloLambda.addToRolePolicy( new PolicyStatement( {
        //     effect: Effect.ALLOW,
        //     actions: [
        //         's3:ListAllMyBuckets',
        //         's3:ListBucket'
        //     ],
        //     resources: ['*']
        // }))
        
        this.spacesLambdaIntegration = new LambdaIntegration( spacesLambda );
    }  
}