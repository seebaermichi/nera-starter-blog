import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'))

// What `nera new --starter` copies into a site (nera-cli/src/starter.js).
const STARTER_ENTRIES = ['pages', 'config', 'theme', 'assets', 'plugins', '.neraignore']

// The theme and the plugins a scaffolded site gets (ROADMAP-ai.md L5).
const DEPENDENCIES = [
    '@nera-static/plugin-code-blocks',
    '@nera-static/plugin-feed',
    '@nera-static/plugin-images',
    '@nera-static/plugin-navigation',
    '@nera-static/plugin-page-pagination',
    '@nera-static/plugin-sitemap',
    '@nera-static/plugin-social-media-links',
    '@nera-static/plugin-tags',
    '@nera-static/theme-blog',
]

describe('package.json starter contract', () => {
    it('names the starter with a label and a description', () => {
        expect(pkg.nera.starter.label).toBe('Blog')
        expect(pkg.nera.starter.description.trim()).not.toBe('')
        // The `nera new` picker shows the npm description, so both say the same.
        expect(pkg.description).toBe(pkg.nera.starter.description)
    })

    it('is found by the starter search', () => {
        expect(pkg.keywords).toEqual(['nera', 'nera-starter', 'static-site-generator', 'starter', 'blog'])
    })

    it('depends on the blog theme and its eight plugins, with caret ranges', () => {
        expect(Object.keys(pkg.dependencies).sort()).toEqual(DEPENDENCIES)
        for (const range of Object.values(pkg.dependencies)) expect(range).toMatch(/^\^\d+\.\d+\.\d+$/)
        expect(pkg.peerDependencies).toBeUndefined()
        expect(pkg.optionalDependencies).toBeUndefined()
    })

    it('uses plugin-page-pagination 2.4.0 or later (its <nav> is labelled)', () => {
        const [major, minor] = pkg.dependencies['@nera-static/plugin-page-pagination']
            .slice(1).split('.').map(Number)
        expect(major === 2 && minor >= 4).toBe(true)
    })

    it('has no lifecycle scripts besides prepare', () => {
        const lifecycle = [
            'preinstall', 'install', 'postinstall', 'prepublish',
            'preprepare', 'postprepare', 'prepublishOnly', 'prepack', 'postpack',
            'publish', 'postpublish',
        ]
        expect(Object.keys(pkg.scripts).filter((s) => lifecycle.includes(s))).toEqual([])
        expect(Object.keys(pkg.scripts).sort()).toEqual(['lint', 'prepare', 'test'])
        expect(pkg.scripts.prepare).toBe('husky')
    })

    it('ships exactly the starter folders that exist, plus the changelog', () => {
        const existing = STARTER_ENTRIES.filter((e) => fs.existsSync(path.join(root, e)))
        expect([...pkg.files].sort()).toEqual([...existing, 'CHANGELOG.md'].sort())
    })

    it('uses the blog theme and ships none of the scaffold-default views', () => {
        const app = fs.readFileSync(path.join(root, 'config', 'app.yaml'), 'utf-8')
        // The CLI's test for a themed starter (nera-cli/src/scaffold.js).
        expect(app).toMatch(/^theme:[ \t]*[^\s#]/m)
        expect(app).toMatch(/^theme: blog$/m)
        for (const file of ['theme/views/layouts/layout.pug', 'theme/views/pages/default.pug']) {
            expect(fs.existsSync(path.join(root, file)), file).toBe(false)
        }
    })
})
