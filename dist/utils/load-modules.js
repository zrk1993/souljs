"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const glob = require("glob");
function globs(root, globsRex, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            glob(Path.join(root, globsRex), options, (er, files) => {
                if (er) {
                    reject(er);
                }
                else {
                    resolve(files);
                }
            });
        });
    });
}
exports.globs = globs;
function loadPackage(packageName) {
    try {
        return require(packageName);
    }
    catch (e) {
        process.exit(1);
    }
}
exports.loadPackage = loadPackage;
//# sourceMappingURL=load-modules.js.map