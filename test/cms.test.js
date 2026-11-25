import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { parse } from 'yaml'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pagesDir = path.join(root, 'pages')
const source = fs.readFileSync(path.join(root, 'config', 'cms.yaml'), 'utf-8')
const cms = parse(source)

// The six cases of nera-pro's FieldType enum (app/Enums/FieldType.php).
const FIELD_TYPES = ['string', 'boolean', 'date', 'number', 'list', 'list_of_objects']

// Where a layout key resolves: the starter's own views win over the theme's.
const VIEW_ROOTS = [
    path.join(root, 'theme', 'views'),
    path.join(root, 'node_modules', '@nera-static', 'theme-blog', 'views'),
]

// A folder key is `folder:` plus the repo-relative directory, as nera-pro's
// groupKeyOf writes it (`folder:pages/posts`).
const FOLDER_PREFIX = 'folder:'
const folderOfKey = (key) => path.join(root, key.slice(FOLDER_PREFIX.length))

// The keys format v1 gives a field; anything else is a typo or a flow-mapping
// value cut at an unquoted comma (`help: a, b` makes `b` a key).
const FIELD_KEYS = ['label', 'help', 'type', 'entries']

const isDirectory = (dir) => fs.existsSync(dir) && fs.statSync(dir).isDirectory()
const isPlainObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

function markdownFiles(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const file = path.join(dir, entry.name)
        if (entry.isDirectory()) return markdownFiles(file)
        return entry.name.endsWith('.md') ? [file] : []
    })
}

// A sample page's frontmatter, parsed as Nera Pro reads it ({} without one).
function frontmatterOf(file) {
    const match = fs.readFileSync(file, 'utf-8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
    return match ? parse(match[1]) : {}
}

const layoutOf = (file) => frontmatterOf(file).layout

const pageTypes = Object.entries(cms.page_types)
const fieldsOf = ([, pageType]) => Object.entries(pageType.fields)

function expectLabelledField(where, field) {
    expect(isPlainObject(field), where).toBe(true)
    for (const key of Object.keys(field)) expect(FIELD_KEYS, `${where} key`).toContain(key)
    expect(typeof field.label, `${where}.label`).toBe('string')
    expect(field.label.trim(), `${where}.label`).not.toBe('')
    if (field.help !== undefined) {
        expect(typeof field.help, `${where}.help`).toBe('string')
        expect(field.help.trim(), `${where}.help`).not.toBe('')
    }
}

describe('config/cms.yaml', () => {
    it('says that only Nera Pro reads it', () => {
        expect(source.split('\n')[0]).toBe('# Read by Nera Pro only; Nera ignores this file.')
    })

    it('parses into a page_types map with fields for every page type', () => {
        expect(Object.keys(cms)).toEqual(['page_types'])
        expect(pageTypes.length).toBeGreaterThan(0)
        for (const [key, pageType] of pageTypes) {
            expect(typeof pageType.label, `${key}.label`).toBe('string')
            expect(pageType.label.trim(), `${key}.label`).not.toBe('')
            expect(isPlainObject(pageType.fields), `${key}.fields`).toBe(true)
            expect(Object.keys(pageType.fields).length, `${key}.fields`).toBeGreaterThan(0)
        }
    })

    it('keys every page type by a layout or a folder that exists', () => {
        for (const [key] of pageTypes) {
            if (key.startsWith(FOLDER_PREFIX)) {
                expect(isDirectory(folderOfKey(key)), key).toBe(true)
            } else {
                expect(VIEW_ROOTS.some((dir) => fs.existsSync(path.join(dir, key))), key).toBe(true)
            }
        }
    })

    it('resolves a folder key the way groupKeyOf writes it', () => {
        expect(isDirectory(folderOfKey('folder:pages/posts'))).toBe(true)
    })

    it('has a page type for every layout a sample page uses', () => {
        const layouts = new Set(markdownFiles(pagesDir).map(layoutOf))
        expect([...layouts].every(Boolean)).toBe(true)
        expect([...layouts].sort()).toEqual(pageTypes.map(([key]) => key).sort())
    })

    it('puts new pages only into folders under pages/', () => {
        for (const [key, pageType] of pageTypes) {
            if (pageType.folder === undefined) continue
            expect(typeof pageType.folder, `${key}.folder`).toBe('string')
            expect(isDirectory(path.join(pagesDir, pageType.folder)), `${key}.folder`).toBe(true)
        }
        expect(cms.page_types['pages/post.pug'].folder).toBe('posts')
    })

    it('labels every field and uses only the six field types', () => {
        for (const pageType of pageTypes) {
            for (const [name, field] of fieldsOf(pageType)) {
                const where = `${pageType[0]}.${name}`
                expectLabelledField(where, field)
                if (field.type !== undefined) expect(FIELD_TYPES, `${where}.type`).toContain(field.type)
            }
        }
    })

    it('gives every list_of_objects field its entries, and only those', () => {
        for (const pageType of pageTypes) {
            for (const [name, field] of fieldsOf(pageType)) {
                const where = `${pageType[0]}.${name}`
                if (field.type !== 'list_of_objects') {
                    expect(field.entries, `${where}.entries`).toBeUndefined()
                    continue
                }
                expect(isPlainObject(field.entries), `${where}.entries`).toBe(true)
                expect(Object.keys(field.entries).length, `${where}.entries`).toBeGreaterThan(0)
                for (const [entry, entryField] of Object.entries(field.entries)) {
                    expectLabelledField(`${where}.entries.${entry}`, entryField)
                }
            }
        }
    })

    it('types the post fields the way the sample posts write them', () => {
        const post = cms.page_types['pages/post.pug'].fields
        expect(post.date.type).toBe('date')
        expect(post.updated.type).toBe('date')
        expect(post.tags.type).toBe('list')
        expect(post.series_part.type).toBe('number')
        expect(post.facts.type).toBe('list_of_objects')
    })

    it('offers the shared blog contract fields a theme switch keeps', () => {
        const post = cms.page_types['pages/post.pug'].fields
        for (const name of ['series', 'series_part', 'facts', 'location']) {
            expect(post[name], name).toBeDefined()
        }
        expect(post.series.type).toBeUndefined()
        expect(post.location.type).toBeUndefined()
    })

    it('matches facts and series_part to the sample post that writes them', () => {
        const file = path.join(pagesDir, 'posts', 'series-and-facts.md')
        const front = frontmatterOf(file)
        const entries = Object.keys(cms.page_types['pages/post.pug'].fields.facts.entries).sort()
        expect(front.facts.length).toBeGreaterThan(0)
        for (const fact of front.facts) expect(Object.keys(fact).sort()).toEqual(entries)
        expect(typeof front.series_part).toBe('number')
    })
})
