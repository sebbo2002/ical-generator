const configuration = {
    'branches': [
        'main',
        {
            'name': 'develop',
            'channel': 'next',
            'prerelease': true
        }
    ],
    'plugins': []
};

configuration.plugins.push(['@semantic-release/commit-analyzer', {
    'releaseRules': [
        {'type': 'build', 'scope': 'deps', 'release': 'patch'},
        {'type': 'docs', 'release': 'patch'}
    ]
}]);

configuration.plugins.push('@semantic-release/release-notes-generator');

configuration.plugins.push(['@semantic-release/exec', {
    'prepareCmd': './.github/workflows/build.sh'
}]);

configuration.plugins.push('@semantic-release/changelog');

configuration.plugins.push('semantic-release-license');

configuration.plugins.push(['@amanda-mitchell/semantic-release-npm-multiple', {
    'registries': {
        'github': {},
        'public': {}
    }
}]);

configuration.plugins.push(['@semantic-release/github', {
    'labels': false,
    'assignees': process.env.GH_OWNER
}]);

configuration.plugins.push(['@semantic-release/git', {
    'assets': ['CHANGELOG.md', 'LICENSE'],
    'message': 'chore(release): :bookmark: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
}]);

if (process.env.DOCKER_LOCAL_IMAGE_DH) {
    configuration.plugins.push(['@semantic-release-plus/docker', {
        name: process.env.DOCKER_LOCAL_IMAGE_DH,
        publishLatestTag: true,
        publishMajorTag: true,
        publishMinorTag: true
    }]);
}

if (process.env.DOCKER_LOCAL_IMAGE_GH) {
    configuration.plugins.push(['@semantic-release-plus/docker', {
        name: process.env.DOCKER_LOCAL_IMAGE_GH,
        registryUrl: 'ghcr.io',
        publishLatestTag: true,
        publishMajorTag: true,
        publishMinorTag: true
    }]);
}

configuration.plugins.push(['@qiwi/semantic-release-gh-pages-plugin', {
    'msg': 'docs: Updated for <%= nextRelease.gitTag %>',
    'src': './docs',
    'dst': `./${process.env.BRANCH}`,
    'pullTagsBranch': 'main'
}]);

module.exports = configuration;
