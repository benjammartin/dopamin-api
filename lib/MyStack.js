import * as cdk from "@aws-cdk/core";
import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    const table = new sst.Table(this, "dopamin", {
      fields: {
        PK: sst.TableFieldType.STRING,
        SK: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "PK", sortKey: "SK" },
    });

    const api = new sst.Api(this, "Api", {
      customDomain: "api.dopamine.link",
      defaultFunctionProps: {
        environment: {
          tableName: table.dynamodbTable.tableName,
        },
      },
      routes: {
        "POST /projects": "src/lambda.create",
      },
    });
    api.attachPermissions([table]);

    new cdk.CfnOutput(this, "ApiEndpoint", {
      value: api.httpApi.apiEndpoint,
    });
  }
}
