import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { CfnIdentityPool, CfnUserPoolGroup, UserPool, UserPoolClient, CfnIdentityPoolRoleAttachment } from 'aws-cdk-lib/aws-cognito';
import { Effect, FederatedPrincipal, PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class AuthStack extends Stack {
    public userPool: UserPool;
    private userPoolClient: UserPoolClient;
    private identityPool: CfnIdentityPool;
    private authenticatedRole: Role;
    private unauthenticatedRole: Role;
    private adminRole: Role;

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        this.createUserPool();
        this.createUserPoolClient();
        this.createIdentityPool();
        this.createRoles();
        this.attachRoles();
        this.createAdminsGroup();
    }
    private createUserPool(){
        this.userPool = new UserPool(this, 'SpaceUserPool', {
            selfSignUpEnabled: true,
            signInAliases: {
                username: true,
                email: true
            }
        });
        new CfnOutput(this, 'SpaceUserPoolId', {
            value: this.userPool.userPoolId
        })
    }
    private createUserPoolClient(){
        this.userPoolClient = this.userPool.addClient('SpaceUserPoolClient', {
            authFlows: {
                adminUserPassword: true,
                custom: true,
                userPassword: true,
                userSrp: true
            }
        });
        new CfnOutput(this, 'SpaceUserPoolClientId', {
            value: this.userPoolClient.userPoolClientId
        })
	}
	
	private createAdminsGroup () {
		new CfnUserPoolGroup( this, 'SpaceAdmins', {
			userPoolId: this.userPool.userPoolId,
            groupName: 'admins',
            roleArn: this.adminRole.roleArn
		})
    }
    
    private createIdentityPool () {
        this.identityPool = new CfnIdentityPool( this, 'SpaceApiIdentityPool', {
            allowUnauthenticatedIdentities: true,
            cognitoIdentityProviders: [ {
                clientId: this.userPoolClient.userPoolClientId,
                providerName: this.userPool.userPoolProviderName
            } ]
        } );

        new CfnOutput( this, 'SpaceIdentityPoolId', {
            value: this.identityPool.ref
        } );
    }

    private createRoles () {
        this.authenticatedRole = new Role( this, 'CognitoDefaultAuthenticatedRole', {
            assumedBy: new FederatedPrincipal( 'cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
        } );

          this.unauthenticatedRole = new Role( this, 'CognitoDefaultUnauthenticatedRole', {
            assumedBy: new FederatedPrincipal( 'cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'unauthenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
          } );
        
          this.adminRole = new Role( this, 'CognitoAdminRole', {
            assumedBy: new FederatedPrincipal( 'cognito-identity.amazonaws.com', {
                StringEquals: {
                    'cognito-identity.amazonaws.com:aud': this.identityPool.ref
                },
                'ForAnyValue:StringLike': {
                    'cognito-identity.amazonaws.com:amr': 'authenticated'
                }
            },
                'sts:AssumeRoleWithWebIdentity'
            )
          } );
        
        this.adminRole.addToPolicy( new PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                "s3:ListAllMyBuckets"
            ],
            resources: ['*']
        })
        );
    }

    private attachRoles () {
        new CfnIdentityPoolRoleAttachment( this, 'RolesAttachment', {
            identityPoolId: this.identityPool.ref,
            roles: {
                authenticated: this.authenticatedRole.roleArn,
                unauthenticated: this.unauthenticatedRole.roleArn
            },
            roleMappings: {
                adminsMapping: {
                    type: 'Token',
                    ambiguousRoleResolution: 'AuthenticatedRole',
                    identityProvider: `${ this.userPool.userPoolProviderName }:${ this.userPoolClient.userPoolClientId }`,
                }
            }
        } );
    }
}