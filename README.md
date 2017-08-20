# CMAD Staging Project

Expected functional features (similar to StackOverFlow) for Staging Release

Without Login
1. Ability to register and login
2. Ability to view all questions
3. Ability to search for questions
4. Ability to view a specific question along with answers

With Login
1. Ability to answer a question
2. Ability to view and update user profile

No UI. All the above features will be tested using postman.

Technology Stack to be used
1. JDK 8 - 
2. MongoDB 3 - https://www.tutorialspoint.com/mongodb/index.htm
3. Vert.x 3 with Java and Javascript verticals - http://tutorials.jenkov.com/vert.x/index.html  http://vertx.io/docs/vertx-core/java/
4. Authentication using JWT -  http://vertx.io/docs/#authentication_and_authorisation

### Build Pipeline
![Tech stack](/docs/screenshots/staging-build-pipeline.png)

### Docker hub repo
![Arch diag](/docs/screenshots/docker-hub-image.png)

### SonarQube Static Code Analysis
![gc_vm_instances diag](/docs/screenshots/sonar-qube-sca.png)

