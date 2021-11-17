export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "appcorona6fe30e1e": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "geo": {
        "coronaCentersMap": {
            "Name": "string",
            "Style": "string",
            "Region": "string",
            "Arn": "string"
        },
        "searchAppCoronaIndex": {
            "Name": "string",
            "Region": "string",
            "Arn": "string"
        }
    },
    "hosting": {
        "S3AndCloudFront": {
            "Region": "string",
            "HostingBucketName": "string",
            "WebsiteURL": "string",
            "S3BucketSecureURL": "string",
            "CloudFrontDistributionID": "string",
            "CloudFrontDomainName": "string",
            "CloudFrontSecureURL": "string",
            "CloudFrontOriginAccessIdentity": "string"
        }
    }
}