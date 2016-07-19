# Setup
1. Install [AWS CLI](https://github.com/aws/aws-cli)
2. Install [NPM](https://github.com/npm/npm)
3. Install node-lambda: `npm install -g node-lambda`
4. Install dependencies: `npm install`

# Deploy to AWS Lambda
1. Copy default config `cp .env.default .env` and modify with your settings
2. Copy default deploy config `cp deploy.env.default deploy.env` and modify with your settings
3. Test: `node-lambda run`
4. Deploy: `node-lambda deploy --configFile=deploy.env`
