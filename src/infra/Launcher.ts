import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { MonitorStack } from "./stacks/MonitorStack";

const app = new App();
const dataStack = new DataStack( app, "DataStack" );
const lambdaStack = new LambdaStack( app, "LambdaStack", { spacesTable: dataStack.spacesTable } );
new ApiStack(app, "ApiStack", {
    spacesLambdaIntegration: lambdaStack.spacesLambdaIntegration
} );
new MonitorStack( app, 'MonitorStack' );
