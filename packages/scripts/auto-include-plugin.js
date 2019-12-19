Object.defineProperty(exports, '__esModule', {value: true});

/** Ensure a value is an array */
const arrayify = arr => (Array.isArray(arr) ? arr : [arr]);
class FilterCommitsByFolderPlugin {
    /** Initialize the plugin with it's options */
    constructor(options) {
        /** The name of the plugin */
        this.name = 'Include only commits which include at least a file in one of the specified folders';
        this.options = {
            paths: options.paths ? arrayify(options.paths) : []
        };
    }

    /** Tap into auto plugin points. */
    apply(auto) {
        auto.hooks.onCreateLogParse.tap(this.name, logParse => {
            logParse.hooks.omitCommit.tap(this.name, commit => {
                if (commit.labels.length === 0) {
                    commit.labels.push('skip-release');
                }

                // Remove current working directory which is added by a path.resolve
                // https://github.com/intuit/auto/blob/v8.6.0/packages/core/src/git.ts:309
                let files = commit.files.map(f => f.substr(process.cwd().length + 1));

                // Keep only files in the requested folder
                files = files.filter(f => this.options.paths.filter(p => f.startsWith(p)).length > 0);

                // Skip (return true) if no file in the commit matches one of the base path
                return files.length === 0;
            });
        });
    }
}
exports.default = FilterCommitsByFolderPlugin;
