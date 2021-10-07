# aws-process-env
This NPM module helps you fetch data from AWS parameter store and assign it to Process.env variable
# aws-process-env
This NPM module helps you fetch data from AWS parameter store and assign it to Process.env variable

## Installation 
### Install via npm 
npm install aws-process-env

## Getting Started
- This module is most helpful when your program is using Parameter store to store environment variables and you need all variables available synchronously as soon as program starts.
- Module will fetch all parameters and will store in Process.env variable.
- It also supports cascading
- You can call this module in main thread.



Example 
```javascript
  const aws = require('aws-process-env');
  aws.getProcessEnv('<AWS_REGION>', '<root path of Parameter store>');
```

| Parameters| default | value |
|:-----------:|:---------:|:-------:|
|region|US-EAST-1| Region where application is running |
|Root Path| none| Path of Parameter store. If none pass '/'| 
 