import { Parent, PhrasingContent } from 'mdast';
import {
    Extension as FromMarkdownExtension,
    Handle as FromMarkdownHandle,
} from 'mdast-util-from-markdown';
import {
    Options as ToMarkdownExtension,
    Handle as ToMarkdownHandle,
} from 'mdast-util-to-markdown';
import { containerPhrasing } from 'mdast-util-to-markdown/lib/util/container-phrasing.js'

export interface Mark extends Parent {
    type: 'mark';
    children: PhrasingContent[];
}

declare module 'mdast' {
    interface StaticPhrasingContentMap {
        mark: Mark;
    }
}

handleMark['peek'] = peekMark

/** @type {FromMarkdownHandle} */
function enterMark(token) {
    this.enter({ type: 'mark', children: [] }, token)
}

/** @type {} */
const exitMark: FromMarkdownHandle = function (token) {
    this.exit(token)
}

var handleMark: ToMarkdownHandle = function (node: Mark, _, context) {
    const exit = context.enter('emphasis')
    const value = containerPhrasing(node, context, { before: '=', after: '=' })
    exit()
    return '==' + value + '=='
}

/** @type {} */
var peekMark: ToMarkdownHandle = function () {
    return '=='
}

export const pandocMarkFromMarkdown: FromMarkdownExtension = {
    canContainEols: ['mark'],
    enter: { mark: enterMark },
    exit: { mark: exitMark }
}

export const pandocMarkToMarkdown: ToMarkdownExtension = {
    unsafe: [{ character: '=', inConstruct: 'phrasing' }],
    handlers: { mark: handleMark }
}