# Contributon Guidelines

Welcome!! First things first, a massive thank you for considering contributing to Immitate. We love receiving contributions from our community, so thanks for stopping by! There are many ways to contribute, including reporting bugs, improving documentation, submitting feature requests, reviewing new submissions, or contributing code that can be incorporated into the project.

### **Table of Contents**

1. [Code of Conduct](#code-of-conduct)
2. [Important Resources](#important-resources)
3. [Feature Requests](#feature-requests)
4. [Reporting a Bug](#reporting-a-bug)
5. [Contributing Code](#contibuting-code)
6. [Pull Request Process](#pull-request-process)

# Code of Conduct
By participating in this project, you agree to abide by our [Code of Conduct][Code-Of-Conduct]. We expect all contributors to follow the [Code of Conduct][Code-Of-Conduct] and to treat fellow humans with respect.

# Important Resources
- [Documentation][Docs]
- [Issues][Issues]
- [Pull Request][Pull-Request]

# Feature Requests

Please create a new GitHub issue for any major changes and enhancements that you wish to make. Please provide the feature you would like to see, why you need it, and how it will work. This will clearly outline the changes and benefits of the feature. [Discuss][Discussion-Issue] your ideas transparently and get community feedback before proceeding.

Small Changes can directly be crafted and submitted to the GitHub Repository as a Pull Request. See the section about [Pull Request Submission Guidelines](#pull-request-submission-guidelines), and for detailed information the core development documentation.

# Reporting a Bug

If you find a security vulnerability, DO NOT open an issue. Email to [sayand031999@gmail.com][Email] instead.

Before you submit your issue, please search the [issue archive][Issues] - maybe your question or issue has already been identified or addressed.

If you find a bug in the source code, you can help us by raising an issue. Even better, you can submit a Pull Request with a fix.

Please provide detailed information is the issue template. That way it is easier for the community to understand exactly where you are facing the problem.

# Contributing Code

Follow the below steps to contribute code to the project.

1. ## Fork the repository
    First things first, go to the [repository page][GHRepo] and fork the repository to your own GitHub account.

1. ## Clone the Repository
    Get the clone link from your forked repository. Open a terminal ( such as `bash`, `powershell`, etc.) and execute the following command to clone the repository.
    ```
    git clone clone_link
    ```

2. ## Create a new branch
    Before you start working, it is recommended to create a new branch for the work you intend to do (bug fixing, implementing a new feature, etc). This helps your code to be separated from the master branch, let's you experiment freely and is also a *best practice*. 

    Create a new branch by executing the below command in your terminal. Replace [name_of_your_new_branch] with an appropriate name for your branch. An appropriate name is short and sweet and clearly indicates the motive of the changes made in this branch. 
    ```bash
    git checkout -b [name_of_your_new_branch]
    ```

3. ## Install Dependencies
    ```
    npm install
    ```

4. ## Do your thing
    Now it is time for you to do your magic. *Expecto Contributum* :p

5. ## Testing
    Please test your code locally before submitting. Please write the unit tests and integration tests that cover your changes thoroughly. If your pull request reduces our test coverage because it lacks tests then it will be rejected. Make sure your tests pass otherwise your pull request will be rejected.

6. ## Add your information 
    Contributors are who power this project. We love to showcase our contributors to the entire community. Please add your details to the [contributors.yaml][Contrbibutors-YAML] file in the format below.

7. ## Create a Pull Request (PR)
    The final step is to create the [Pull Request][Pull-Request]. Read the [pull request process](#pull-request-process) to know more. 

# Pull Request Process

When you are ready to generate a pull request, either for preliminary review, or for consideration of merging into the project you must first push your local topic branch back up to GitHub:

```
git push origin newfeature
```

Once you've committed and pushed all of your changes to GitHub, go to the page for your fork on GitHub, select your development branch, and click the pull request button. If you need to make any adjustments to your pull request, just push the updates to your branch. Your pull request will automatically track the changes on your development branch and update.

## Review Process

Once a pull request is received, it is carefully reviewed by the core team. If all is good, the pull request will be merged. On the other hand, feedback may also be provided to change or improve certain aspects of the PR. If the creator of the pull request doesn't respond within two weeks after the feedback is provided, the PR is closed.

We try our best to respond to every pull request within a week. The one week timespan also allows our contributor(s) to take a look at the PR and helps us get a +1 on it.

Anyone who reviews a pull request should leave a note to let others know that someone has looked at it

## Addressing Feedback

Once a PR has been submitted, your changes will be reviewed and constructive feedback may be provided. Feedback isn't meant as an attack, but to help make sure best quality code makes it into our project. Changes will be approved once required feedback has been addressed.


[Code-Of-Conduct]: ./CODE_OF_CONDUCT.md
[Docs]: ./
[Issues]: https://github.com/senshiii/immitate/issues
[Discussion-Issue]: https://www.google.com
[Pull-Request]: https://github.com/senshiii/immitate/pulls
[Email]: mailto:sayand031999@gmail.com
[GHRepo]: https://github.com/senshiii/immitate