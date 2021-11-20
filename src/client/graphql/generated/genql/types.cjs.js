module.exports = {
    "scalars": [
        0,
        2,
        3,
        4,
        5,
        6
    ],
    "types": {
        "DateTime": {},
        "Mutation": {
            "createFriend": [
                11,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "createProject": [
                7,
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
                9,
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
                        "Float!"
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
                        6,
                        "PaidPlan!"
                    ],
                    "projectId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "deleteStrategie": [
                9,
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
            "removeFunds": [
                11,
                {
                    "id": [
                        2,
                        "String!"
                    ],
                    "value": [
                        2,
                        "String!"
                    ]
                }
            ],
            "toogleActivateStrategie": [
                9,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "toogleIsActivated": [
                11,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "updateStrategie": [
                9,
                {
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
                    "isError": [
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
                    "player": [
                        2
                    ],
                    "playsCount": [
                        5
                    ],
                    "roundsCount": [
                        5
                    ]
                }
            ],
            "updateUser": [
                11,
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
        "Float": {},
        "Boolean": {},
        "Int": {},
        "PaidPlan": {},
        "Project": {
            "id": [
                2
            ],
            "name": [
                2
            ],
            "paidPlan": [
                6
            ],
            "slug": [
                2
            ],
            "users": [
                11,
                {
                    "after": [
                        12
                    ],
                    "before": [
                        12
                    ],
                    "first": [
                        5
                    ],
                    "last": [
                        5
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "Query": {
            "currentUser": [
                11
            ],
            "getUsers": [
                11
            ],
            "project": [
                7,
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
                9,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "user": [
                11,
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
            "generated": [
                2
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
            "isError": [
                4
            ],
            "isNeedRestart": [
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
                5
            ],
            "private": [
                2
            ],
            "roundsCount": [
                5
            ],
            "startedAmount": [
                3
            ],
            "user": [
                11
            ],
            "__typename": [
                2
            ]
        },
        "StrategieWhereUniqueInput": {
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
            "isActivated": [
                4
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
                11,
                {
                    "after": [
                        12
                    ],
                    "before": [
                        12
                    ],
                    "first": [
                        5
                    ],
                    "last": [
                        5
                    ]
                }
            ],
            "registeredAt": [
                0
            ],
            "strategies": [
                9,
                {
                    "after": [
                        10
                    ],
                    "before": [
                        10
                    ],
                    "first": [
                        5
                    ],
                    "last": [
                        5
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