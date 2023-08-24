### KeyleSSH
A keyless SSH Web client made possible by Tide 

### What Makes It Different from Other SSH Clients?

Traditional SSH clients often require users to possess the authentication key stored locally. In contrast, Tide revolutionizes the concept of SSH clients by eliminating the need for locally stored keys, resulting in a significantly heightened level of security. Notably, Tide ensures that the authentication key is never assembled at any point in time, bolstering its security measures even further.

By having the authentication key remote, the SSH client has unprecedented flexibility to function from virtually anywhere. This innovative approach liberates users from the constraints of their physical devices and locations, redefining the realm of SSH client operations.

### Architecture

![Architecture.](https://github.com/tide-foundation/KeyleSSH/blob/main/diagrams/svg/KeyleSSH%20Architecture.svg)

### The building blocks

Builds on the projects [WebSSH2](https://github.com/billchurch/webssh2) and [SSH2] (https://github.com/mscdex/ssh2/tree/master) to incorporate the Tide flow into their user authentication mechanisms.

We needed to make two changes to the process: firstly, we shifted the sourcing of the public key from the front-end (previously located in config.json), and secondly, we now generate a signature from the front-end instead of constructing it in the backend.

### Installation

## Requirements
Node v14.x which can be downloaded [here] (https://nodejs.org/en).

## Installing KeyleSSH

Follow these steps to install KeyleSSH on your server:

1. Clone the KeyleSSH repository:
   ```
   git clone https://github.com/tide-foundation/Tide-SSH
   ```

2. Navigate to the KeyleSSH web directory:
   ```
   cd Tide-SSH/web/
   ```

3. Configure the `config.json` file according to your server's specific needs. Refer to the [config file options guide](https://github.com/billchurch/webssh2/blob/main/README.md#config-file-options) for assistance. Note that for this project, you do not need to include a username or public key.

4. Install the necessary dependencies using npm:
   ```
   npm install
   ```

5. Visit [this JSFiddle link](https://jsfiddle.net/NotMyDog/vos0eLbq/4/) and replace the variable `YourSiteURL` with your site's origin. The origin is the base URL without any path or query parameters. For example, if your full URL is `https://example.com:8000/maps?location=10`, the origin is `https://example.com:8000`. Check the console on the JSFiddle page to find `vendorPublic` and `vendorUrlSignature` values. Save these for later use.

6. On your server, navigate to `Tide-SSH/web/client/src/js/index.ts`.

7. Locate the `config` object within the file. Inside this object, you'll find fields for `vendorPublic` and `vendorUrlSignature`. Insert the values you copied from the JSFiddle page into these fields.

8. Go back to the `Tide-SSH/web/client/src/` directory:
   ```
   cd Tide-SSH/web/client/src/
   ```

9. Build the project:
   ```
   npm run build
   ```

10. Return to the `Tide-SSH/web/` directory:
    ```
    cd Tide-SSH/web/
    ```

11. Start the KeyleSSH server:
    ```
    npm start
    ```

These steps will guide you through the process of installing and configuring KeyleSSH on your server.

## Creating your Tide Account
1. Using a web browser, navigate to your chosen IP address and port (e.g., `mysshserver.io:8000/ssh/host`).
2. Create a Tide account through the login window on the displayed page. 
3. Take note of the provided username and public key after successfully creating the account. This will need to be added to the SSH server by you or the SSH administrator
4. Update the `authorized_keys` file by adding the acquired username and public key.

![Sign-up Flow.](https://github.com/tide-foundation/KeyleSSH/blob/main/diagrams/svg/Sign-up.svg)

### How to Use the Web Client:

1. Access the Web Client by entering your SSH server's address in a web browser (e.g., `mysshserver.io:8000/ssh/host`). 
2. Sign in using the previously obtained credentials.  

![Sign-in Flow.](https://github.com/tide-foundation/KeyleSSH/blob/main/diagrams/svg/Sign-in.svg)
