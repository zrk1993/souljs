import * as Path from 'path';
import * as glob from 'glob';

export async function globs(root: string, globs: string, options?: glob.IOptions): Promise<Array<string>> {
  return new Promise((resolve, reject) => {
    glob(Path.join(root, globs), options, function(er, files) {
      // files is an array of filenames.
      // If the `nonull` option is set, and nothing
      // was found, then files is ["**/*.js"]
      // er is an error object or null.

      if (er) {
        reject(er);
      } else {
        resolve(files);
      }
    });
  });
}

export function loadPackage(packageName: string) {
  try {
    return require(packageName);
  } catch (e) {
    process.exit(1);
  }
}
