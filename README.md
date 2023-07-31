# ONS pattern library - Deprecated

This app is now deprecated, the app will be only updated for critical updates or bug fixes for areas of the site that have not been migrated to use the [dp-design-system](https://github.com/ONSdigital/dp-design-system).

## How to install and run

1. Clone this repo onto your machine.
2. Install [Node][node] and [NPM][npm].
3. Run `npm install` from the root of the repo you've cloned onto your machine.
4. Use the JS and CSS files in the `dist` directory.

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
