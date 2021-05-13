module.exports = {
    'branches': [
        'main',
        {
            'name': 'develop',
            'channel': 'next',
            'prerelease': true
        }
    ],
    'plugins': [
        ['@semantic-release/commit-analyzer', {
            'releaseRules': [
                {'type': 'build', 'scope': 'deps', 'release': 'patch'},
                {'type': 'docs', 'release': 'patch'}
            ]
        }],
        '@semantic-release/release-notes-generator',
        ['@semantic-release/exec', {
            'prepareCmd': './.github/workflows/build.sh'
        }],
        '@semantic-release/changelog',
        'semantic-release-license',
        '@semantic-release/npm',
        ['@semantic-release/github', {
            'labels': false,
            'assignees': process.env.GH_OWNER
        }],
        ['@semantic-release/git', {
            'assets': ['CHANGELOG.md', 'LICENSE'],
            'message': 'chore(release): :bookmark: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
        }],
        ['@qiwi/semantic-release-gh-pages-plugin', {
            'msg': 'docs: Updated for <%= nextRelease.gitTag %>',
            'src': './docs',
            'dst': `./${process.env.BRANCH}`,
            'pullTagsBranch': 'main'
        }]
    ]
};
