# ltv-cli

_A CLI for interacting with the Leisure Travel Vans API._

## Install

```bash
npm install -g ltv-cli
```

## Usage

```bash
λ ltv help
  _       _____  __     __     ____   _       ___
 | |     |_   _| \ \   / /    / ___| | |     |_ _|
 | |       | |    \ \ / /    | |     | |      | |
 | |___    | |     \ V /     | |___  | |___   | |
 |_____|   |_|      \_/       \____| |_____| |___|

    $ ltv [command] <options>

    USAGE
      $ ltv auth                authenticate
      $ ltv dealer              find dealers
      $ ltv orders              find orders
      $ ltv version             show package version
      $ ltv help                show this help menu
```
### Auth
```bash
$ ltv auth
```
You will need to run `ltv auth` before running any other commands. Use your LTV Dealer Dashboard login to authenticate.

### Dealer Commands

#### Find All Dealers
```bash
$ ltv dealer find
```

#### Find a Single Dealer
```bash
$ ltv dealer find -d 13201
```

### Order Commands

#### Find All Orders By Dealer
```bash
$ ltv order find -d 13201
```

#### Find a Single Order

**To find by name:**

The `--dealer` / `-d` argument is required to search by customer name.
```bash
$ ltv order find -d 13201 -n smith
```

**To find by coach ID / run #:**
```bash
$ ltv order find -c 28255
```

**To find by chassis VIN:**
```bash
$ ltv order find -V WDAPF4CC8H9743879
```

**To find by order ID:**
```bash
$ ltv order find -o 25461
```

#### Invite a User to MyLTV
```bash
$ ltv order invite -o 23524 -e joe@bob.com -n Joe Smith
```

This command will find the order with that ID and send an invite by email to the provided email address.
