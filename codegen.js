module.exports = {
    schema: [
        {
            'https://dev-gql.meem.wtf/v1/graphql': {
                //'https://alpha-gql.meem.wtf/v1/graphql': {
                headers: {
                    'x-hasura-admin-secret': process.env.HASURA_SECRET
                },
            },
        },
    ],
    documents: ['./src/**/*.tsx', './src/**/*.ts'],
    overwrite: true,
    generates: {
        './generated/graphql.tsx': {
            plugins: [
                'typescript',
                'typescript-operations',
                'typescript-react-apollo',
            ],
            config: {
                skipTypename: false,
                withHooks: true,
                withHOC: false,
                withComponent: false,
            },
        },
        './generated/graphql.schema.json': {
            plugins: ['introspection'],
        },
    },
};