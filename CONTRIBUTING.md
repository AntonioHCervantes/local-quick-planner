# Contribution Guidelines

First of all, thank you for considering contributing to this project! We appreciate your time and effort. To ensure a smooth and collaborative process, we have established a set of guidelines to follow.

## Code of Conduct

This project and everyone participating in it is governed by a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please ensure the bug was not already reported by searching on GitHub under [Issues](issues). If you're unable to find an open issue addressing the problem, [open a new one](issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample** or an **executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

If you have an idea to improve the project, please open an issue with the "enhancement" label. Describe your idea, why it would be beneficial, and if possible, provide a code sample or a mockup.

## Development

### Project Setup

1. Fork the repository.
2. Clone your fork: `git clone https://github.com/your-username/checkplanner.git`
3. Install dependencies: `npm install`
4. Run the development server: `npm run dev`

### Pull Requests

When you are ready to submit your contribution, please follow these steps:

1. Create a new branch for your changes: `git checkout -b your-feature-name`
2. Make your changes and commit them following the guidelines below.
3. Push your changes to your fork: `git push origin your-feature-name`
4. Open a Pull Request (PR) to the `main` branch of the original repository.
5. Ensure the PR description clearly describes the problem and solution. Include the relevant issue number if applicable.

### Commit Messages

We use the [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/) specification. This allows for automated changelog generation and helps keep the commit history clean and easy to understand.

Your commit messages should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Common types:**

*   **feat**: A new feature.
*   **fix**: A bug fix.
*   **docs**: Documentation only changes.
*   **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc).
*   **refactor**: A code change that neither fixes a bug nor adds a feature.
*   **perf**: A code change that improves performance.
*   **test**: Adding missing tests or correcting existing tests.
*   **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation.

**Example:**

```
feat(auth): add password reset functionality

Implement the password reset flow by adding a new endpoint and sending a reset email.

Closes: #23
```

By following these guidelines, you help keep the project maintainable and easy for everyone to contribute to. Thank you!