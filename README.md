### KeyleSSH
A keyless SSH Web client made possible by Tide 

### What Makes It Different from Other SSH Clients?

Traditional SSH clients often require users to possess the authentication key stored locally. In contrast, Tide revolutionizes the concept of SSH clients by eliminating the need for locally stored keys, resulting in a significantly heightened level of security. Notably, Tide ensures that the authentication key is never assembled at any point in time, bolstering its security measures even further.

By having the authentication key remote, the SSH client has unprecedented flexibility to function from virtually anywhere. This innovative approach liberates users from the constraints of their physical devices and locations, redefining the realm of SSH client operations.

### Architecture

![Architecture.](https://github.com/tide-foundation/KeyleSSH/blob/main/diagrams/svg/KeyleSSH%20Architecture.svg)

### Installation

## Requirements
Node v14.x or above... 

## Web SSH Server

1. Install the SSH Webclient npm package by executing the appropriate installation command.
2. Using a web browser, navigate to your chosen IP address and port (e.g., `mysshserver.io:8000/ssh/host`).
3. Create a Tide account through the login window on the displayed page. ![Sign-up Flow.](https://github.com/tide-foundation/KeyleSSH/blob/main/diagrams/svg/admin-signup.svg)
4. Make note of the provided username and public key after successfully creating the account.
5. Update the `authorized_keys` file by adding the acquired username and public key.

### How to Use the Web Client:

1. Access the Web Client by entering your SSH server's address in a web browser (e.g., `mysshserver.io:8000/ssh/host`). 
2. Sign in using the previously obtained credentials.  ![Sign-in Flow.](https://github.com/tide-foundation/KeyleSSH/blob/main/diagrams/svg/Sign-in.svg)
