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
            'preset': 'angular',
            'releaseRules': [
                {'type': 'refactor', 'release': 'patch'},
                {'type': 'style', 'release': 'patch'},
                {'type': 'build', 'scope': 'deps', 'release': 'patch'},
                {'type': 'docs', 'release': 'patch'}
            ]
        }],
        ['@semantic-release/release-notes-generator', {
            'preset': 'angular',
            'writerOpts': {
                'commitsSort': ['subject', 'scope']
            }
        }],
        ['@semantic-release/exec', {
            'prepareCmd': './build.sh'
        }],
        '@semantic-release/changelog',
        '@semantic-release/npm',
        '@semantic-release/github',
        ['@semantic-release/git', {
            'assets': ['CHANGELOG.md'],
            'message': 'chore(release): :bookmark: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
        }],
        ['@qiwi/semantic-release-gh-pages-plugin', {
            'msg': 'docs: Updated for <%= nextRelease.gitTag %>',
            'src': './doc',
            'dst': `./${process.env.BRANCH}`,
            'pullTagsBranch': 'main'
        }]
    ]
};
