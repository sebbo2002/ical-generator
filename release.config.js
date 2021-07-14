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

configuration.push(['@semantic-release/commit-analyzer', {
    'releaseRules': [
        {'type': 'build', 'scope': 'deps', 'release': 'patch'},
        {'type': 'docs', 'release': 'patch'}
    ]
}]);

configuration.push('@semantic-release/release-notes-generator');

configuration.push(['@semantic-release/exec', {
    'prepareCmd': './.github/workflows/build.sh'
}]);

configuration.push('@semantic-release/changelog');

configuration.push('semantic-release-license');

configuration.push(['@amanda-mitchell/semantic-release-npm-multiple', {
    'registries': {
        'github': {},
        'public': {}
    }
}]);

configuration.push(['@semantic-release/github', {
    'labels': false,
    'assignees': process.env.GH_OWNER
}]);

configuration.push(['@semantic-release/git', {
    'assets': ['CHANGELOG.md', 'LICENSE'],
    'message': 'chore(release): :bookmark: ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}'
}]);

if(process.env.DOCKER_LOCAL_IMAGE_DH) {
    configuration.push(['@eclass/semantic-release-docker', {
        'baseImageName': process.env.DOCKER_LOCAL_IMAGE_DH,
        'registries': [
            {
                'url': 'docker.io',
                'imageName': 'docker.io/' + process.env.DOCKER_REGISTRY_IMAGE,
                'user': 'DOCKER_REGISTRY_USERNAME',
                'password': 'DOCKER_REGISTRY_TOKEN'
            }
        ]
    }]);
}

if(process.env.DOCKER_LOCAL_IMAGE_GH) {
    configuration.push(['@eclass/semantic-release-docker', {
        'baseImageName': 'ghcr.io/' + process.env.DOCKER_LOCAL_IMAGE_GH,
        'registries': [
            {
                'url': 'ghcr.io',
                'imageName': 'ghcr.io/' + process.env.GH_REPO,
                'user': 'GITHUB_REGISTRY_USERNAME',
                'password': 'GITHUB_REGISTRY_TOKEN'
            }
        ]
    }]);
}

configuration.push(['@qiwi/semantic-release-gh-pages-plugin', {
    'msg': 'docs: Updated for <%= nextRelease.gitTag %>',
    'src': './docs',
    'dst': `./${process.env.BRANCH}`,
    'pullTagsBranch': 'main'
}]);

module.exports = configuration;
