# Add stories to base glob

__Deprecation warning!__

Our base [glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern did not include the stories directory, this caused task like `lint` to pass on CI although there were linting errors regarding files inside of the stories directory.

We will change the base glob pattern to include the `stories` directory on the following date: **`24 September 2017`**

You should fix your linting errors until this date, in order to get this change before the above date, please add this to your `package.json` file:

```json
{
  "yoshi": {
    "features": {
      "addStoriesToBaseGlob": true
    }
  }
}
```

** If you see more side effects regarding this feature, please open an issue and let us know about it !
