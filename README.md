# after-effects-node
___

Originally forked from `After Effects`, but is now mostly a complete rewrite.

## Notable Features plus Differences between original fork

* Same Features
    * Send a JS Function from Node environment and execute within After Effects process
    * Transforms ES6 into ES3 for compatibility in After Effects JS environment
* Differences
    * Support some additinoal ES6
    * Improved ability to send and receive JSON objects between Node and After Effects
    * Ability to turn After Effects objects into JSON
    * Error reporting back to the Node process with line # and line text of the source of error
    * Logger called by invoking `log.info()`
        * Logger automatically converts After Script objects into JSON that can be logged
        * Logging occurrs to a log file as well as to the Node console
    * All files generated in current working directory for easier debugging
        * All files persist after script execution for easier debugging
        * Generated JS file can be run in After Effects debugger environment as well to assist with debugging
    * Automatically adds undo group around executing script
    * Only supporting Windows ( the only environment I have to develop and test )
    * Much simplified API
        * I'm building and supporting only what I'm using at the moment

## Future considerations

* Convert library to TypeScript

## Sample Usage

