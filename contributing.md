# Contributing a Plugin

### Do not PR a plugin with malicious intent. 

I curate the added plugins, and will ban you from the repository if I see you attempt to add a malicious plugin (ex. token stealing)

### Describe your plugin

Please don't just create a blank PR. Give a short description of your plugin.

### Commit a `readme.md` file

This should contain a description of your plugin, as well as a way to contact you (github name, and optionally discord name).

### Don't commit the `config.json` file

These are considered deprecated and are being phased out. Plus, they're automatically generated anyways.

### Test your plugin

Don't PR a broken mess. Test your plugin before submitting, preferably on multiple operating systems.

#### NOTE

Remember: Linux and Mac users use DI too! When dealing with file paths, don't hardcode the Windows `\` delimiter, 
as it will break on unix operating systems. Always use the 
[`path.join`](https://nodejs.org/api/path.html#path_path_join_paths) function to get paths 
that are correct on all systems.

### Have fun

If you're not enjoying it, you're doing it wrong.

# Contributing to a Plugin

To contribute fixes, new features, etc. to existing plugins, follow the same guidelines as previously mentioned, as well as the following guidelines:

### Ping the plugin's author

This is so that they're aware of the potential changes, and can review them as needed. I will only merge the PR at the original author's consent.
