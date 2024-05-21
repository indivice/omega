# Omega

This repository contains the source code for the npm package `@indivice/omega`. It is a framework for building web applications, providing a set of essential components and tools to make development easier and faster.

## Documentation

Learn how Omega works here:
https://learn.omegajs.org

## Getting Started

### Prerequisites

Before you start using the framework, you need to have Node.js and npm installed on your system.

### Installing

To use the framework in your project, simply install it as a dependency:

```java
npm i @indivice/omega
```
Or you can scaffold new projects without manual setup

```java
npx degit indivice/omega/ts <app-name>
cd <app-name>
npm i
```

## Understanding the code

The source code for the framework can be found in the `src` folder.

- `index.ts` contains the entry point for the framework. This is where the exports for the framework are defined.

- `components.ts` contains the web components that make up the framework. This is where the core functionality is implemented.

- `driver.ts` contains some driver-specific helpers, that are useful for implementing custom drivers

- `type.ts` is a type-safety module which contains types for components, their properties and events

- `web/index.ts` contains the main, and default render engine for the web platform

- `web/router.ts` contains the code for the advanced router module for the web platform

- The `dist` folder contains the final code that will be shipped to npmjs.

## Building the code

The source code can be built using the build.sh script. It requires
Python3 and TSC (Typescript Compiler) pre-installed.

Then use the following commands in the core directory:

```java
chmod +x build.sh //run this command only once to give script permission
./build.sh
```
Note: Requires the terser package to work correctly.

## Contributing

We welcome contributions to the framework! If you'd like to contribute, please read through our contribution guidelines to get started.

## Versioning

The framework uses a versioning system of `x.y.z-tag-codename`, where:

- `x` represents a major breaking release,
- `y` represents a minor change, mostly new feature,
- `z` represents small bug-fixes or re-tweaks,
- `tag` can be `alpha`, `beta`, `delta`, or `final`, and denotes the stage of development the code is in.
- `codename` can be any number followed by:
    - `E`: meaning enhanced
    - `S`: meaning bug-fixed
    - `ES`: both `E` and `S` in the same package.

## License

This project is licensed under the [MIT License](LICENSE).