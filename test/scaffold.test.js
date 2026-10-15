import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { execFileSync } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const cli = path.join(root, 'node_modules', '@nera-static', 'nera', 'bin', 'nera.js')
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'))

const TIMEOUT = 180_000

// What `nera new --starter` copies into a site (nera-cli/src/starter.js).
const STARTER_ENTRIES = ['pages', 'config', 'theme', 'assets', 'plugins', '.neraignore']

const POSTS = ['posts/write-a-post.html', 'posts/tags.html', 'posts/feed.html']
const PAGES = ['index.html', 'archive.html', 'about.html', 'imprint.html', 'privacy.html', ...POSTS]

// The theme fixture's config/validate.yaml (nera-theme-blog test/site): every
// rule of `nera check` on, the opt-in ones included, promoted to error so a
// finding fails the check; its legal paths reduced to the English pages.
const STRICT_VALIDATE = `rules:
${[
        'a11y-html-lang', 'a11y-title', 'a11y-h1', 'a11y-heading-skip', 'a11y-img-alt',
        'a11y-form-label', 'a11y-link-name', 'a11y-main', 'a11y-skip-link', 'a11y-nav-name',
        'a11y-duplicate-id', 'a11y-viewport-zoom', 'a11y-link-lang', 'a11y-target-blank',
        'a11y-reduced-motion', 'privacy-third-party', 'privacy-insecure', 'privacy-storage',
        'legal-imprint-link', 'legal-privacy-link', 'legal-outdated-law',
    ].map((rule) => `    ${rule}: error`).join('\n')}
legal:
    imprint:
        en: /imprint.html
    privacy:
        en: /privacy.html
`

let tmp

beforeAll(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'nera-starter-blog-'))
})

afterAll(() => {
    fs.rmSync(tmp, { recursive: true, force: true })
})

const nera = (args, cwd) =>
    execFileSync(process.execPath, [cli, ...args], {
        cwd,
        encoding: 'utf-8',
        stdio: 'pipe',
    })

// Scaffold `name` from this repo with the devDependency CLI, offline: a
// local starter path is read in place and --no-install skips npm. The site
// then resolves the CLI, the theme and the plugins from this repo's
// node_modules (they are this package's dependencies).
function scaffold(name, extra = []) {
    nera(['new', name, '--starter', root, '--yes', '--no-install', ...extra], tmp)
    const site = path.join(tmp, name)
    fs.symlinkSync(path.join(root, 'node_modules'), path.join(site, 'node_modules'), 'dir')
    return site
}

const read = (dir, file) => fs.readFileSync(path.join(dir, file), 'utf-8')

// Every file below `dir`, as paths relative to it.
function walk(dir, base = dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name)
        return entry.isDirectory() ? walk(full, base) : [path.relative(base, full)]
    })
}

// Build, check and validate: no finding, and no warning from core or a
// plugin anywhere in the build's text output.
function expectCleanBuild(site) {
    const out = nera(['build', '--check'], site)
    expect(out).toContain('No problems found')
    expect(out).not.toMatch(/\d+ error\(s\), \d+ warning\(s\)/)
    expect(out).not.toMatch(/warn|⚠/i)

    const json = JSON.parse(nera(['build', '--check', '--json'], site))
    expect(json).toEqual({ ok: true, results: [] })

    expect(nera(['validate'], site)).toContain('No problems found')
    expect(JSON.parse(nera(['validate', '--json'], site))).toEqual({ ok: true, results: [] })
}

describe('nera new --starter <this repo>', () => {
    let site

    beforeAll(() => {
        site = scaffold('site')
    }, TIMEOUT)

    it('scaffolds a site that builds, checks and validates clean', () => {
        expectCleanBuild(site)
    }, TIMEOUT)

    it('stays clean with every check rule on and promoted to error', () => {
        const strict = scaffold('site-strict')
        fs.writeFileSync(path.join(strict, 'config', 'validate.yaml'), STRICT_VALIDATE)
        expectCleanBuild(strict)
    }, TIMEOUT)

    it('renders every page, tag page, the feed, the sitemap and the code-blocks stylesheet', () => {
        const pub = path.join(site, 'public')
        for (const file of [
            ...PAGES, 'feed.xml', 'sitemap.xml', 'robots.txt', '_nera/code-blocks.css',
            'tags/writing.html', 'tags/nera.html',
        ]) {
            expect(fs.existsSync(path.join(pub, file)), file).toBe(true)
        }
    })

    it('writes an Atom feed with one absolute entry per post', () => {
        const feed = read(site, 'public/feed.xml')
        expect(feed).toContain('<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">')
        expect(feed.match(/<entry>/g)).toHaveLength(POSTS.length)
        for (const post of POSTS) {
            expect(feed).toContain(`<link rel="alternate" type="text/html" href="https://example.com/${post}"/>`)
        }
        const sitemap = read(site, 'public/sitemap.xml')
        expect(sitemap).toContain('<loc>https://example.com/index.html</loc>')
        // The post's `updated`, not its `date` (plugin-sitemap >= 1.1.0).
        expect(sitemap).toMatch(/<loc>https:\/\/example\.com\/posts\/tags\.html<\/loc>\s*<lastmod>2026-01-12<\/lastmod>/)
        expect(read(site, 'public/robots.txt')).toContain('Sitemap: https://example.com/sitemap.xml')
    })

    it('fills the seams: feed link, navigation, tags, prev/next, picture, social links', () => {
        const home = read(site, 'public/index.html')
        expect(home).toMatch(/<link rel="alternate" type="application\/atom\+xml" href="\/feed\.xml"/)
        expect(home).toContain('<ul class="nav nav--list">')
        expect(home).toContain('class="tag-cloud')
        expect(home).toContain('href="/archive.html"')

        // The middle post by date has both neighbours.
        const post = read(site, 'public/posts/tags.html')
        expect(post).toContain('<nav class="page-pagination" aria-label="Pagination">')
        expect(post).toContain('page-pagination__link--previous" href="/posts/feed.html"')
        expect(post).toContain('page-pagination__link--next" href="/posts/write-a-post.html"')
        expect(post).toContain('<a class="tag-links__item" href="/tags/writing.html">writing</a>')
        expect(post).toMatch(/<div class="post__media">\s*<picture>/)
        expect(post).toContain('alt="Shapes in rust, grey and sand on a light background"')
        expect(post).toContain('<nav class="social-media-links" aria-label="Social media">')
        expect(post).not.toContain('target="_blank"')

        const code = read(site, 'public/posts/write-a-post.html')
        expect(code).toContain('<b>pages/posts/hello.md</b>')
        expect(code).not.toContain('nera-code__copy')

        const tag = read(site, 'public/tags/writing.html')
        expect(tag).toContain('<h1 class="tag-overview__title">writing</h1>')
        expect(tag).toContain('<meta name="description" content="All posts with this tag.">')
        // A calendar date read in UTC (plugin-tags >= 3.4.0), whatever the build's time zone.
        expect(tag).toContain('<time class="tag-overview__item-date" datetime="2026-09-21">September 21, 2026</time>')

        const archive = read(site, 'public/archive.html')
        expect(archive.match(/class="post-archive__year"/g)).toHaveLength(2)
    })

    it('makes no third-party request and ships no JavaScript', () => {
        const pub = path.join(site, 'public')
        const html = walk(pub).filter((f) => f.endsWith('.html'))
        expect(html.length).toBeGreaterThanOrEqual(PAGES.length)
        for (const file of html) {
            const page = read(pub, file)
            expect(page, file).not.toMatch(/<script/i)
            expect(page, file).not.toMatch(/<(?:link|img|source|iframe|video|audio)\b[^>]*\s(?:href|src|srcset)="(?:https?:)?\/\//i)
        }
        for (const file of walk(pub).filter((f) => f.endsWith('.css'))) {
            expect(read(pub, file), file).not.toMatch(/url\(\s*['"]?(?:https?:)?\/\/|@import/i)
        }
    })

    it('links only to pages and files that exist', () => {
        const pub = path.join(site, 'public')
        for (const file of walk(pub).filter((f) => f.endsWith('.html'))) {
            for (const [, url] of read(pub, file).matchAll(/\s(?:href|src)="(\/[^"#?]*)/g)) {
                expect(fs.existsSync(path.join(pub, url)), `${file} → ${url}`).toBe(true)
            }
        }
    })

    it('copies only the starter folders into the site, byte for byte', () => {
        for (const file of [
            'README.md', 'CHANGELOG.md', 'LICENSE', 'eslint.config.js',
            'package-lock.json', 'test', '.github', '.husky', 'plans',
        ]) {
            expect(fs.existsSync(path.join(site, file)), file).toBe(false)
        }
        const entries = STARTER_ENTRIES.filter((e) => fs.existsSync(path.join(root, e)))
        const files = entries.flatMap((e) => walk(path.join(root, e)).map((f) => path.join(e, f)))
        expect(files.length).toBeGreaterThan(30)
        for (const file of files) {
            expect(fs.readFileSync(path.join(site, file)).equals(fs.readFileSync(path.join(root, file))), file)
                .toBe(true)
        }
    })

    it('leaves out the scaffold\'s nera:scaffold-default views', () => {
        for (const file of ['theme/views/layouts/layout.pug', 'theme/views/pages/default.pug']) {
            expect(fs.existsSync(path.join(site, file)), file).toBe(false)
        }
    })

    it('keeps the site\'s own CLI entry and adds the theme and the plugins', () => {
        const sitePkg = JSON.parse(read(site, 'package.json'))
        expect(sitePkg.name).toBe('site')
        expect(sitePkg.dependencies).toHaveProperty('@nera-static/nera')
        expect(sitePkg.dependencies).toEqual({
            '@nera-static/nera': sitePkg.dependencies['@nera-static/nera'],
            ...pkg.dependencies,
        })
    })
})

describe('nera new --starter <this repo> --name "Brot & Zeit" --lang de', () => {
    let site

    beforeAll(() => {
        site = scaffold('site-de', ['--name', 'Brot & Zeit', '--lang', 'de'])
    }, TIMEOUT)

    it('sets name and lang and copies the English texts into a de entry', () => {
        const app = read(site, 'config/app.yaml')
        expect(app).toMatch(/^name: "Brot & Zeit"$/m)
        expect(app).toMatch(/^lang: de$/m)
        expect(app).toMatch(/^theme: blog$/m)
        expect(app).toMatch(/^ {4}de:\n(?: {8}.+\n)*? {8}Skip to content: Skip to content$/m)
        expect(app).toMatch(/^ {4}de:\n(?: {8}.+\n)*? {8}Pagination: Pagination$/m)
    })

    it('still builds, checks and validates clean', () => {
        expectCleanBuild(site)
        const html = read(site, 'public/index.html')
        expect(html).toContain('<html lang="de">')
        expect(html).toContain('<title>Welcome – Brot &amp; Zeit</title>')
        expect(fs.existsSync(path.join(site, 'public', 'feed.xml'))).toBe(true)
        // `en` stays beside the copied `de`, but no English page exists: no
        // one-item switch (theme-blog >= 1.0.3).
        expect(html).not.toContain('lang-switch')
    }, TIMEOUT)

    it('renders German, without a language switch, with the README\'s German texts alone', () => {
        const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf-8')
        const de = readme.match(/```yaml\n( {4}de:\n[\s\S]*?)```/)[1]
        const app = read(site, 'config/app.yaml')
        // As the README says: replace the copied `de:` entry, keep `en:`.
        fs.writeFileSync(path.join(site, 'config', 'app.yaml'), `${app.split(/^ {4}de:$/m)[0]}${de}`)
        expect(read(site, 'config/app.yaml')).toMatch(/^ {4}en:$/m)

        expectCleanBuild(site)
        const home = read(site, 'public/index.html')
        expect(home).not.toContain('lang-switch')
        expect(home).toContain('Zum Inhalt springen')
        expect(home).toContain('Neueste Beiträge')
        expect(read(site, 'public/posts/tags.html')).toContain('aria-label="Blätternavigation"')
    }, TIMEOUT)
})
