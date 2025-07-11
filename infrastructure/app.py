#!/usr/bin/env python3
import aws_cdk as cdk
from amplify_app_stack import AmplifyAppStack

app = cdk.App()

# Create stack for dev environment
AmplifyAppStack(app, "HibiscusHealthStack-dev", 
               env=cdk.Environment(account="676373376343", region="eu-west-1"))

app.synth() 