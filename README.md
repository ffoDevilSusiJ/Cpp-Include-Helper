# Auto Include

Automatically add include directives for C++ classes in your project.

## Features

- Automatically scans the workspace for C++ header and source files.
- Suggests `#include` directives for classes found in the workspace.
- Updates the class map every 30 seconds and on demand.
- Provides commands to trigger workspace analysis and add includes.

## Usage

1. Install the extension.
2. Open a C++ project in VS Code.
3. Use the command `Make an analysis` to scan the workspace for C++ classes.
4. Start typing a class name to see suggestions for `#include` directives.
5. Select a suggestion to automatically add the `#include` directive to your file.

## Commands

- `Make an analysis`: Manually trigger an analysis of the workspace.
- `Add Include`: Add an include directive for the selected class.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/ffoDevilSusiJ/auto-include.git
    cd auto-include
    ```

2. Install dependencies and compile the extension:
    ```bash
    npm install
    npm run compile
    ```

3. Open the project in VS Code and press `F5` to run the extension in a new VS Code window.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to submit issues and pull requests to improve the project.
