# Discorde Front-end

Web Interface for Discorde website

## Requirements

| Name | Version |
|------|---------|
| **node** | **>= 15** |
| **docker** | **>= 19** |
| **docker-compose** | **>= 1.26** |

### Install dependencies

```sh
$> yarn # or npm install
```

## Usages

> Don't forget to `Install dependencies` before running any command below

### Build App

```sh
$> yarn build # or npm run build
```

### Start

In Developpement

```sh
$> yarn dev # or npm run dev
```

In Production

```sh
$> yarn start # or npm start
```

### Serve

```sh
$> yarn serve ## or npm run serve
```

### Lint

```sh
$> yarn lint # or npm run lint
```

### Test

[Cypress](https://www.cypress.io/) is an end-to-end testing tools for anything that runs in a browser.

> Before running any command below, start the in developpement or production mode

Run cypress with GUI

```sh
$> yarn cypress:open # or npm run cypress:open
```

Run cypress without GUI

```sh
$> yarn cypress # or npm run cypress
```