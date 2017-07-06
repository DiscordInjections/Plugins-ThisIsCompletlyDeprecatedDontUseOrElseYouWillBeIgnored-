# Plugins

This is a collection of plugins for the [DiscordInjections](https://github.com/DiscordInjections/DiscordInjections) project.

## Contribution

To contribute a plugin, please make a PR. Your plugin should follow the following structure:

```
Folder - PluginName
  |
  |-- css (optional)
  | |-- css files (optional)
  |-- index.js (or as specified in package.json)
  |-- readme.md
  |-- package.json
  |-- config.json (optional, is generated)
  |-- license.md (optional)
```

You may have as many CSS files in the CSS folder as you desire. They will, however, all be combined into a single style element before being injected.

Please refer to `SamplePlugin/SamplePlugin.js` for a plugin template.