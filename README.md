### KeyleSSH
A keyless SSH Web client made possible by Tide 

### What Makes It Different from Other SSH Clients?

Secure Shell (SSH) is a cryptographic network protocol that enables secure communication between two systems over an unsecured network. It is widely used by system administrators to manage servers and network devices remotely. SSH provides a secure channel over which data can be exchanged, using various encryption techniques to ensure confidentiality and integrity.

Traditionally, SSH authentication has been done using just a username and password. However, this method has many limitations and vulnerabilities. The most secure approach is considered to be using cryptographic keys, specifically Public Key Infrastructure (PKI). Unfortunately, this secure approach often requires users to possess the authentication key to be stored locally or somewhere centrally, which has proven time and again to be compromised. In contrast, Tide revolutionizes the concept of SSH client authentication by eliminating the need for locally stored keys, resulting in a significantly hardened level of security. Notably, Tide ensures that the authentication key is never stored, accessed or assembled at any point in time, bolstering its security measures even further and making it a keyless solution that forever prevents the compromise of a private key.

By having the authentication key managed remotely, the SSH client has unprecedented flexibility to function from virtually anywhere. This innovative approach liberates users from the constraints of their physical devices and locations, redefining the realm of SSH client operations.

### Architecture

![Architecture.](https://github.com/tide-foundation/KeyleSSH/blob/main/diagrams/svg/KeyleSSH%20Architecture.svg)

### The building blocks

Builds on the Open-Source projects [WebSSH2](https://github.com/billchurch/webssh2) and [SSH2](https://github.com/mscdex/ssh2/tree/master) to incorporate the Tide flow into their user authentication mechanisms.

We needed to make two changes to the process: firstly, we shifted the sourcing of the public key from the SSH Proxy's front-end (previously located in config.json), and secondly, we now generate a signature from the front-end instead of constructing it in the backend - without accessing the full private key.

### Installation

## Requirements
Node v14.x which can be downloaded [here](https://nodejs.org/en).

## Installing KeyleSSH

Follow these steps to install KeyleSSH on your SSH Proxy server:

1. Clone the KeyleSSH repository:
   ```
   git clone https://github.com/tide-foundation/KeyleSSH
   ```

2. Navigate to the KeyleSSH web directory:
   ```
   cd KeyleSSH/web/
   ```

3. Configure the `config.json` file according to your server's specific needs. Refer to the [config file options guide](https://github.com/billchurch/webssh2/blob/main/README.md#config-file-options) for assistance. Note that for this project, you must not include the username or privateKey.

4. Install the necessary dependencies using npm:
   ```
   npm install
   ```

5. Go to web/vendorSign.mjs and replace the variable `yourURL` with your site's origin. The origin is the base URL without any path or query parameters. For example, if your full URL is `https://example.com:8000/maps?location=10`, the origin is `https://example.com:8000`. Run the file and save the public key and signature values provided for later use.

7. On your server, navigate to `KeyleSSH/web/client/src/js/index.ts`.

8. Locate the `config` object within the file. Inside this object, you'll find fields for `vendorPublic` and `vendorUrlSignature`. Insert the values you copied from before into these fields.

9. Go back to the `KeyleSSH/web/client/src/` directory:
   ```
   cd KeyleSSH/web/client/src/
   ```

10. Build the project:
   ```
   npm run build
   ```

11. Return to the `KeyleSSH/web/` directory:
    ```
    cd KeyleSSH/web/
    ```

12. Start the KeyleSSH server:
    ```
    npm start
    ```

These steps will guide you through the process of installing and configuring KeyleSSH on your SSH Proxy server.

## Creating your Tide Account
1. Using a web browser, navigate to your chosen IP address and port (e.g., `mysshserver.io:8000`).
2. Create a Tide account through the login window on the displayed page. 
3. Take note of the provided username and public key after successfully creating the account. This will need to be added to the SSH server by you or the SSH administrator
4. Update the `authorized_keys` file by adding the acquired username and public key.

![Sign-up Flow.](https://github.com/tide-foundation/KeyleSSH/blob/main/diagrams/svg/Sign-up.svg)

### How to Use the Web Client:

1. Access the Web Client by entering your SSH Proxy server's address in a web browser (e.g., `mysshserver.io:8000`). 
2. Sign in using your Tide credentials.  

![Sign-in Flow.](https://github.com/tide-foundation/KeyleSSH/blob/main/diagrams/svg/Sign-in.svg)
