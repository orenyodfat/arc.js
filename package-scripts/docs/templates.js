/**
 * This file contains various templates used to render `.md` files.
 *
 * author: Matan Tsuberi (dev.matan.tsuberi@gmail.com)
 */

const path = require('path');

/* This is a little trick to make templates more readable.
 * used in templates like :
 * `line1${N
 * }line2`
 * to keep indentation in the code from rendering as indentation in the output.
 * */
const N = '\n';

/**
 * @function tableOfContents - renders a table of contents page from a file hierarchy
 * @param hierarchy - an object of the form {'path':{'to':{'dir':{'contractName': 'path/to/result.md'}}}}
 * @param header - an `.md` string to be included in the template.
 */
const tableOfContents = (hierarchy, header) => {
    hierarchy = hierarchy['.'].contracts; // remove unnessesery dirs
    const tree = (indent, hierarchy) => {
        const spaces = Array(indent).fill(' ').join('');
        return (
            Object.keys(hierarchy).map(k =>
                typeof hierarchy[k] === 'string' ?
                    `${spaces}- [${k}](${hierarchy[k].replace(path.sep, '/')})`
                    :
                    `${spaces}- ${k}/ ${N
                    }${tree(indent + 2, hierarchy[k])}`
            ).join(N)
        );
    };

    return (
        `# Table of Contents${N
        }${header}${N
        }${tree(0, hierarchy)}${N
        }`);
};

module.exports = { tableOfContents };
