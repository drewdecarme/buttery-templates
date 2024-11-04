# @buttery/commands

## 0.2.1

### Patch Changes

- d8f4a0d: Changes all internal cross-references to exact references upon `npm publish`
- Updated dependencies [d8f4a0d]
  - @buttery/core@0.1.1

## 0.2.0

### Minor Changes

- e97b428: Adds a `components.export` script to select exports to copy into a directory of the user's choosing

  This changeset adds a new CLI command that allows the user to export any components inside of the `@buttery/components` package and output them to a directory of their choosing. This allows for the user to easily export the components that they see in the documentation and use in their own project and update as needed.

  This changeset also addresses some issues when trying to publish the packages to the NPM registry.

## 0.1.0

### Minor Changes

- 61f5b2e: Re-architects the repository to become a modular focused repo

  This changeset does a good deal of architecting to break the modules back out into their own packages. This ensures that all functionality associated with that particular tool is kept local to that package. A new package called `@buttery/core` has been added to easily distribute core modules to each of the `@buttery/tools`. These tools then use the core module to transpile, build, and distribute the local scripts externally.

  Another package called `@buttery/cli` has been created that should be installed alongside of whatever tool is desired to use. This ensures that we're not downloading too many dependencies and makes the CLI modules opt-in rather than a "nuts and bolts" approach.

### Patch Changes

- Updated dependencies [61f5b2e]
  - @buttery/core@0.1.0