/**
 * @typedef {import('mdast').Delete} Delete
 * @typedef {import('mdast-util-from-markdown').Extension} FromMarkdownExtension
 * @typedef {import('mdast-util-from-markdown').Handle} FromMarkdownHandle
 * @typedef {import('mdast-util-to-markdown').Options} ToMarkdownExtension
 * @typedef {import('mdast-util-to-markdown').Handle} ToMarkdownHandle
 */

import { containerPhrasing } from 'mdast-util-to-markdown/lib/util/container-phrasing.js'

/** @type {FromMarkdownExtension} */
export const pandocMarkFromMarkdown = {
  canContainEols: ['mark'],
  enter: { mark: enterMark },
  exit: { mark: exitMark }
}

/** @type {ToMarkdownExtension} */
export const pandocMarkToMarkdown = {
  unsafe: [{ character: '~', inConstruct: 'phrasing' }],
  handlers: { delete: handleMark }
}

handleMark.peek = peekMark

/** @type {FromMarkdownHandle} */
function enterMark(token) {
  this.enter({ type: 'mark', children: [] }, token)
}

/** @type {FromMarkdownHandle} */
function exitMark(token) {
  this.exit(token)
}

/**
 * @type {ToMarkdownHandle}
 * @param {Delete} node
 */
function handleMark(node, _, context) {
  const exit = context.enter('emphasis')
  const value = containerPhrasing(node, context, { before: '~', after: '~' })
  exit()
  return '~~' + value + '~~'
}

/** @type {ToMarkdownHandle} */
function peekMark() {
  return '~'
}
