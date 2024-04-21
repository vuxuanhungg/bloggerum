import { MONGODB_POSTS_INDEX } from '../constants'

// TODO: Type value of this object instead of any
export const commonPostAggregationPipelineStages: Record<string, any> = {
    joinUsersCollection: {
        // join users collection with posts
        $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
        },
    },
    prettifyUserField: {
        // prettify the result
        // make the "user" field an object instead of an array with one object
        $addFields: {
            user: {
                $first: '$user',
            },
        },
    },
    singlePostProject: {
        $project: {
            title: 1,
            body: 1,
            thumbnail: 1,
            user: {
                _id: 1,
                name: 1,
                avatar: 1,
                bio: 1,
            },
            tags: 1,
            updatedAt: 1,
        },
    },
    multiplePostsProject: {
        $project: {
            posts: 1,
            totalPages: {
                $ifNull: [
                    {
                        $ceil: {
                            $divide: [{ $first: '$count.count' }, 14],
                        },
                    },
                    0,
                ],
            },
        },
    },
}

export const getPostsByUserOrTagPipeline = (
    query: any,
    skip: number,
    limit: number
) => [
    { $match: query },
    { $sort: { updatedAt: -1 } },
    {
        $facet: {
            posts: [
                commonPostAggregationPipelineStages.joinUsersCollection,
                commonPostAggregationPipelineStages.prettifyUserField,
                commonPostAggregationPipelineStages.singlePostProject,
                { $skip: skip },
                { $limit: limit },
            ],
            count: [{ $count: 'count' }],
        },
    },
    commonPostAggregationPipelineStages.multiplePostsProject,
]

export const getPostsBySearchPipeline = (
    query: string,
    skip: number,
    limit: number
) => [
    {
        $search: {
            index: MONGODB_POSTS_INDEX,
            text: {
                query,
                path: ['title', 'tags', 'body'],
                fuzzy: { maxEdits: 1 },
            },
        },
    },
    {
        $facet: {
            posts: [
                commonPostAggregationPipelineStages.joinUsersCollection,
                commonPostAggregationPipelineStages.prettifyUserField,
                {
                    $project: {
                        ...commonPostAggregationPipelineStages.singlePostProject
                            .$project,
                        score: {
                            $meta: 'searchScore',
                        },
                    },
                },
                {
                    $match: {
                        score: { $gt: 0 },
                    },
                },
                { $skip: skip },
                { $limit: limit },
            ],
            count: [{ $count: 'count' }],
        },
    },
    commonPostAggregationPipelineStages.multiplePostsProject,
]
