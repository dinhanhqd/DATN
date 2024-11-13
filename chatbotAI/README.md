### Setup

Download and Install NodeJS >= 18.15.0
Install PNPM
`bash
   npm i -g pnpm
    `

1.  Clone the repository

    ```bash
    git clone https://github.com/dinhanhqd/chatbotAI.git
    ```

2.  Go into repository folder

    ```bash
    cd chatbotAI
    ```

3.  Install all dependencies of all modules:

    ```bash
    pnpm install
    ```

4.  Build all the code:

    ```bash
    set NODE_OPTIONS=--max-old-space-size=4096
    pnpm run build

    ```

    <details>
    <summary>Exit code 134 (JavaScript heap out of memory)</summary>  
      If you get this error when running the above `build` script, try increasing the Node.js heap size and run the script again:

        export NODE_OPTIONS="--max-old-space-size=4096"
        pnpm build

    </details>

5.  Start the app:

    ```bash
    pnpm start
    ```

    run file index.html
