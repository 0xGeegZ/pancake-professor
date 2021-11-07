module.exports = {
    "scalars": [
        1,
        2,
        4,
        5,
        6,
        8,
        11
    ],
    "types": {
        "BoolFilter": {
            "equals": [
                1
            ],
            "not": [
                7
            ],
            "__typename": [
                4
            ]
        },
        "Boolean": {},
        "DateTime": {},
        "Mutation": {
            "createFriend": [
                15,
                {
                    "id": [
                        4,
                        "String!"
                    ]
                }
            ],
            "createProject": [
                9,
                {
                    "name": [
                        4,
                        "String!"
                    ],
                    "slug": [
                        4
                    ]
                }
            ],
            "createStrategie": [
                12,
                {
                    "maxLooseAmount": [
                        5
                    ],
                    "minWinAmount": [
                        5
                    ],
                    "player": [
                        4,
                        "String!"
                    ],
                    "startedAmount": [
                        5,
                        "Float!"
                    ]
                }
            ],
            "createStripeCheckoutBillingPortalUrl": [
                4,
                {
                    "projectId": [
                        4,
                        "String!"
                    ]
                }
            ],
            "createStripeCheckoutSession": [
                4,
                {
                    "plan": [
                        8,
                        "PaidPlan!"
                    ],
                    "projectId": [
                        4,
                        "String!"
                    ]
                }
            ],
            "deleteStrategie": [
                12,
                {
                    "id": [
                        4,
                        "String!"
                    ]
                }
            ],
            "inviteToProject": [
                1,
                {
                    "email": [
                        4,
                        "String!"
                    ],
                    "projectId": [
                        4,
                        "String!"
                    ]
                }
            ],
            "toogleActivateStrategie": [
                12,
                {
                    "id": [
                        4,
                        "String!"
                    ]
                }
            ],
            "updateStrategie": [
                12,
                {
                    "currentAmount": [
                        5,
                        "Float!"
                    ],
                    "id": [
                        4,
                        "String!"
                    ],
                    "isActive": [
                        1
                    ],
                    "isDeleted": [
                        1
                    ],
                    "isError": [
                        1
                    ],
                    "isRunning": [
                        1
                    ],
                    "maxLooseAmount": [
                        5,
                        "Float!"
                    ],
                    "minWinAmount": [
                        5,
                        "Float!"
                    ],
                    "player": [
                        4,
                        "String!"
                    ],
                    "playsCount": [
                        6,
                        "Int!"
                    ],
                    "roundsCount": [
                        6,
                        "Int!"
                    ],
                    "startedAmount": [
                        5,
                        "Float!"
                    ]
                }
            ],
            "updateUser": [
                15,
                {
                    "address": [
                        4,
                        "String!"
                    ],
                    "email": [
                        4
                    ],
                    "id": [
                        4,
                        "String!"
                    ],
                    "name": [
                        4
                    ]
                }
            ],
            "__typename": [
                4
            ]
        },
        "String": {},
        "Float": {},
        "Int": {},
        "NestedBoolFilter": {
            "equals": [
                1
            ],
            "not": [
                7
            ],
            "__typename": [
                4
            ]
        },
        "PaidPlan": {},
        "Project": {
            "id": [
                4
            ],
            "name": [
                4
            ],
            "paidPlan": [
                8
            ],
            "slug": [
                4
            ],
            "users": [
                15,
                {
                    "after": [
                        17
                    ],
                    "before": [
                        17
                    ],
                    "first": [
                        6
                    ],
                    "last": [
                        6
                    ]
                }
            ],
            "__typename": [
                4
            ]
        },
        "Query": {
            "currentUser": [
                15
            ],
            "getUsers": [
                15
            ],
            "project": [
                9,
                {
                    "id": [
                        4
                    ],
                    "slug": [
                        4
                    ]
                }
            ],
            "strategie": [
                12,
                {
                    "id": [
                        4,
                        "String!"
                    ]
                }
            ],
            "user": [
                15,
                {
                    "id": [
                        4,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                4
            ]
        },
        "SortOrder": {},
        "Strategie": {
            "createdAt": [
                2
            ],
            "currentAmount": [
                5
            ],
            "id": [
                4
            ],
            "isActive": [
                1
            ],
            "isDeleted": [
                1
            ],
            "isError": [
                1
            ],
            "isRunning": [
                1
            ],
            "maxLooseAmount": [
                5
            ],
            "minWinAmount": [
                5
            ],
            "modifiedAt": [
                2
            ],
            "player": [
                4
            ],
            "playsCount": [
                6
            ],
            "roundsCount": [
                6
            ],
            "startedAmount": [
                5
            ],
            "user": [
                15
            ],
            "__typename": [
                4
            ]
        },
        "StrategieOrderByInput": {
            "createdAt": [
                11
            ],
            "currentAmount": [
                11
            ],
            "id": [
                11
            ],
            "isActive": [
                11
            ],
            "isDeleted": [
                11
            ],
            "isError": [
                11
            ],
            "isRunning": [
                11
            ],
            "maxLooseAmount": [
                11
            ],
            "minWinAmount": [
                11
            ],
            "modifiedAt": [
                11
            ],
            "player": [
                11
            ],
            "playsCount": [
                11
            ],
            "roundsCount": [
                11
            ],
            "startedAmount": [
                11
            ],
            "userId": [
                11
            ],
            "__typename": [
                4
            ]
        },
        "StrategieWhereUniqueInput": {
            "id": [
                4
            ],
            "__typename": [
                4
            ]
        },
        "User": {
            "address": [
                4
            ],
            "createdAt": [
                2
            ],
            "email": [
                4
            ],
            "generated": [
                4
            ],
            "id": [
                4
            ],
            "loginAt": [
                2
            ],
            "modifiedAt": [
                2
            ],
            "name": [
                4
            ],
            "private": [
                4
            ],
            "referrals": [
                15,
                {
                    "after": [
                        17
                    ],
                    "before": [
                        17
                    ],
                    "first": [
                        6
                    ],
                    "last": [
                        6
                    ]
                }
            ],
            "registeredAt": [
                2
            ],
            "strategies": [
                12,
                {
                    "after": [
                        14
                    ],
                    "before": [
                        14
                    ],
                    "first": [
                        6
                    ],
                    "last": [
                        6
                    ],
                    "orderBy": [
                        13,
                        "[StrategieOrderByInput!]"
                    ],
                    "where": [
                        16
                    ]
                }
            ],
            "__typename": [
                4
            ]
        },
        "UserStrategiesWhereInput": {
            "isActive": [
                0
            ],
            "isDeleted": [
                0
            ],
            "isRunning": [
                0
            ],
            "__typename": [
                4
            ]
        },
        "UserWhereUniqueInput": {
            "address": [
                4
            ],
            "email": [
                4
            ],
            "generated": [
                4
            ],
            "id": [
                4
            ],
            "private": [
                4
            ],
            "__typename": [
                4
            ]
        }
    }
}