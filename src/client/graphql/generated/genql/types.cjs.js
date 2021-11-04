module.exports = {
    "scalars": [
        0,
        2,
        3,
        4,
        5
    ],
    "types": {
        "DateTime": {},
        "Mutation": {
            "createFriend": [
                10,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "createProject": [
                6,
                {
                    "name": [
                        2,
                        "String!"
                    ],
                    "slug": [
                        2
                    ]
                }
            ],
            "createStrategie": [
                8,
                {
                    "maxLooseAmount": [
                        3
                    ],
                    "minWinAmount": [
                        3
                    ],
                    "player": [
                        2,
                        "String!"
                    ],
                    "startedAmount": [
                        3,
                        "Int!"
                    ]
                }
            ],
            "createStripeCheckoutBillingPortalUrl": [
                2,
                {
                    "projectId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "createStripeCheckoutSession": [
                2,
                {
                    "plan": [
                        5,
                        "PaidPlan!"
                    ],
                    "projectId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "deleteStrategie": [
                8,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "inviteToProject": [
                4,
                {
                    "email": [
                        2,
                        "String!"
                    ],
                    "projectId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "toogleActivateStrategie": [
                8,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "updateStrategie": [
                8,
                {
                    "currentAmount": [
                        3,
                        "Int!"
                    ],
                    "id": [
                        2,
                        "String!"
                    ],
                    "isActive": [
                        4
                    ],
                    "isDeleted": [
                        4
                    ],
                    "isRunning": [
                        4
                    ],
                    "maxLooseAmount": [
                        3,
                        "Int!"
                    ],
                    "minWinAmount": [
                        3,
                        "Int!"
                    ],
                    "player": [
                        2,
                        "String!"
                    ],
                    "playsCount": [
                        3,
                        "Int!"
                    ],
                    "roundsCount": [
                        3,
                        "Int!"
                    ],
                    "startedAmount": [
                        3,
                        "Int!"
                    ]
                }
            ],
            "updateUser": [
                10,
                {
                    "address": [
                        2,
                        "String!"
                    ],
                    "email": [
                        2
                    ],
                    "id": [
                        2,
                        "String!"
                    ],
                    "name": [
                        2
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "String": {},
        "Int": {},
        "Boolean": {},
        "PaidPlan": {},
        "Project": {
            "id": [
                2
            ],
            "name": [
                2
            ],
            "paidPlan": [
                5
            ],
            "slug": [
                2
            ],
            "users": [
                10,
                {
                    "after": [
                        11
                    ],
                    "before": [
                        11
                    ],
                    "first": [
                        3
                    ],
                    "last": [
                        3
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "Query": {
            "currentUser": [
                10
            ],
            "getUsers": [
                10
            ],
            "project": [
                6,
                {
                    "id": [
                        2
                    ],
                    "slug": [
                        2
                    ]
                }
            ],
            "strategie": [
                8,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "user": [
                10,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "Strategie": {
            "createdAt": [
                0
            ],
            "currentAmount": [
                3
            ],
            "id": [
                2
            ],
            "isActive": [
                4
            ],
            "isDeleted": [
                4
            ],
            "isRunning": [
                4
            ],
            "maxLooseAmount": [
                3
            ],
            "minWinAmount": [
                3
            ],
            "modifiedAt": [
                0
            ],
            "player": [
                2
            ],
            "playsCount": [
                3
            ],
            "roundsCount": [
                3
            ],
            "startedAmount": [
                3
            ],
            "user": [
                10
            ],
            "__typename": [
                2
            ]
        },
        "StrategieWhereUniqueInput": {
            "id": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "User": {
            "address": [
                2
            ],
            "createdAt": [
                0
            ],
            "email": [
                2
            ],
            "generated": [
                2
            ],
            "id": [
                2
            ],
            "loginAt": [
                0
            ],
            "modifiedAt": [
                0
            ],
            "name": [
                2
            ],
            "private": [
                2
            ],
            "referrals": [
                10,
                {
                    "after": [
                        11
                    ],
                    "before": [
                        11
                    ],
                    "first": [
                        3
                    ],
                    "last": [
                        3
                    ]
                }
            ],
            "registeredAt": [
                0
            ],
            "strategies": [
                8,
                {
                    "after": [
                        9
                    ],
                    "before": [
                        9
                    ],
                    "first": [
                        3
                    ],
                    "last": [
                        3
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "UserWhereUniqueInput": {
            "address": [
                2
            ],
            "email": [
                2
            ],
            "generated": [
                2
            ],
            "id": [
                2
            ],
            "private": [
                2
            ],
            "__typename": [
                2
            ]
        }
    }
}