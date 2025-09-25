# ONS pattern library - Deprecated

This app is now deprecated, the app will be only updated for critical updates or bug fixes for areas of the site that have not been migrated to use the [dp-design-system](https://github.com/ONSdigital/dp-design-system).

## How to install and run

### Using nvm

If you work across multiple Node.js projects there's a good chance they require different Node.js and npm versions.

To enable this we use [nvm (Node Version Manager)](https://github.com/creationix/nvm) to switch between versions easily.

- [Install nvm using git](https://github.com/nvm-sh/nvm?tab=readme-ov-file#git-install)

**Note** brew is not supported as an installation option

1. Clone this repo in the root of your user profile
    - `cd ~/` from anywhere then `git clone https://github.com/nvm-sh/nvm.git .nvm`
1. `cd ~/.nvm` and check out the latest version with e.g. `git checkout v0.39.7`
1. Activate `nvm` by sourcing it from your shell: `. ./nvm.sh`

Add these lines to your `~/.bashrc`, `~/.profile`, or `~/.zshrc` file to have it automatically sourced upon login:
(you may have to add to more than one of the above files)

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

- Run nvm install in the project directory (this will use .nvmrc)

```bash
nvm install
```

### Manually install Node and NPM

- Install [Node][node] (version denoted in `.nvmrc`) and [NPM][npm].

### Run the app

1. Run `npm install && npm run dev` from the root of the repo you've cloned onto your machine.
1. Use the JS and CSS files in the `dist` directory.

## jQuery

This app uses jQuery, the calling app will need to have the following snippet inserted above the sixteens JS injection.

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
```

## Updating Sixteens

* Either run `npm run dev` or `run.sh` in the root of the project. This boots up an npm watch command that'll re-build your JS, CSS on change and host it at localhost:9000/dist/folder/file.
* New JS files go into the `js` directory and the path added into the config object in the package.json. You'll need to restart `npm run dev` if you edit the package.json for the watch to detect them.
* New SCSS files should be added to the `scss` directory. Add the path into `main.scss` and `old-ie.scss`.

### Updating 'work in progress' CSS

Sixteens builds a separate CSS file for 'work in progress' styling.

SCSS for these patterns are stored in `scss/work-in-progress`. Once they're a production pattern they should be moved into the usual SCSS file structures.

To build the work in progress patterns run:
`npm run build-work-in-progress`

or to re-build these patterns automatically when an SCSS file is updated run:
`npm run watch-work-in-progress`

This will create or update the `work-in-progress.css` file in `dist`.

[node]: <https://nodejs.org/en/>
[npm]: <https://www.npmjs.com/>

### Tooling

For Javascript auditing we use `auditjs` which requires you to [setup an OSS Index account](https://github.com/ONSdigital/dp/blob/main/guides/MAC_SETUP.md#oss-index-account-and-configuration)
