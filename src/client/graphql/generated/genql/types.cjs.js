module.exports = {
    "scalars": [
        0,
        2,
        3,
        4,
        7,
        8,
        9
    ],
    "types": {
        "DateTime": {},
        "Favorite": {
            "comment": [
                2
            ],
            "createdAt": [
                0
            ],
            "id": [
                2
            ],
            "modifiedAt": [
                0
            ],
            "note": [
                3
            ],
            "player": [
                2
            ],
            "type": [
                4
            ],
            "user": [
                14
            ],
            "__typename": [
                2
            ]
        },
        "String": {},
        "Int": {},
        "FavoriteType": {},
        "FavoriteWhereUniqueInput": {
            "id": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "Mutation": {
            "createFriend": [
                14,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "createProject": [
                10,
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
                12,
                {
                    "betAmount": [
                        7,
                        "Float!"
                    ],
                    "color": [
                        2
                    ],
                    "decreaseAmount": [
                        3
                    ],
                    "increaseAmount": [
                        3
                    ],
                    "isTrailing": [
                        8
                    ],
                    "maxLooseAmount": [
                        7
                    ],
                    "minWinAmount": [
                        7
                    ],
                    "name": [
                        2
                    ],
                    "player": [
                        2,
                        "String!"
                    ],
                    "startedAmount": [
                        7,
                        "Float!"
                    ],
                    "stopLoss": [
                        3
                    ],
                    "takeProfit": [
                        3
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
                        9,
                        "PaidPlan!"
                    ],
                    "projectId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "deleteStrategie": [
                12,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "inviteToProject": [
                8,
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
                14,
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
                12,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "toogleIsActivated": [
                14,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "updateStrategie": [
                12,
                {
                    "betAmount": [
                        7
                    ],
                    "color": [
                        2
                    ],
                    "decreaseAmount": [
                        3
                    ],
                    "id": [
                        2,
                        "String!"
                    ],
                    "increaseAmount": [
                        3
                    ],
                    "isActive": [
                        8
                    ],
                    "isDeleted": [
                        8
                    ],
                    "isError": [
                        8
                    ],
                    "isRunning": [
                        8
                    ],
                    "isTrailing": [
                        8
                    ],
                    "maxLooseAmount": [
                        7
                    ],
                    "minWinAmount": [
                        7
                    ],
                    "name": [
                        2
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
                    "stopLoss": [
                        3
                    ],
                    "takeProfit": [
                        3
                    ]
                }
            ],
            "updateUser": [
                14,
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
        "Float": {},
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
                9
            ],
            "slug": [
                2
            ],
            "users": [
                14,
                {
                    "after": [
                        15
                    ],
                    "before": [
                        15
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
                14
            ],
            "getAllFavorites": [
                1
            ],
            "getUsers": [
                14
            ],
            "project": [
                10,
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
                12,
                {
                    "id": [
                        2,
                        "String!"
                    ]
                }
            ],
            "user": [
                14,
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
            "betAmount": [
                7
            ],
            "color": [
                2
            ],
            "createdAt": [
                0
            ],
            "currentAmount": [
                7
            ],
            "decreaseAmount": [
                3
            ],
            "generated": [
                2
            ],
            "history": [
                2
            ],
            "id": [
                2
            ],
            "increaseAmount": [
                3
            ],
            "isActive": [
                8
            ],
            "isDeleted": [
                8
            ],
            "isError": [
                8
            ],
            "isNeedRestart": [
                8
            ],
            "isRunning": [
                8
            ],
            "isTrailing": [
                8
            ],
            "maxLooseAmount": [
                7
            ],
            "minWinAmount": [
                7
            ],
            "modifiedAt": [
                0
            ],
            "name": [
                2
            ],
            "player": [
                2
            ],
            "playsCount": [
                3
            ],
            "private": [
                2
            ],
            "roundsCount": [
                3
            ],
            "startedAmount": [
                7
            ],
            "stopLoss": [
                3
            ],
            "takeProfit": [
                3
            ],
            "user": [
                14
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
            "favorites": [
                1,
                {
                    "after": [
                        5
                    ],
                    "before": [
                        5
                    ],
                    "first": [
                        3
                    ],
                    "last": [
                        3
                    ]
                }
            ],
            "generated": [
                2
            ],
            "id": [
                2
            ],
            "isActivated": [
                8
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
                14,
                {
                    "after": [
                        15
                    ],
                    "before": [
                        15
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
                12,
                {
                    "after": [
                        13
                    ],
                    "before": [
                        13
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