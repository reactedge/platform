# Accuracy Evaluation Agent

## High-Level Aim
Assess the quality and relevance of intent search results using a hybrid deterministic and semantic evaluation approach.

## Step 1: Input
- IntentSearchEvent

### Example Input (simplified)
```json
{
  "intentId": "uuid",
  "intentText": "waterproof hiking jacket",
  "filtersApplied": {
    "material": ["gore-tex"]
  },
  "resultCount": 12
}
```

### Real input
```json
{
    "intent": {
        "text": "",
        "signals": {
            "climate": {
                "Warm": 1
            },
            "material": {
                "Polyester": 1
            }
        }
    },
    "attributes": [
        {
            "code": "color",
            "label": "Color",
            "options": [
                {
                    "label": "Black",
                    "value": "49",
                    "count": 22
                },
                {
                    "label": "Blue",
                    "value": "50",
                    "count": 25
                },
                {
                    "label": "Brown",
                    "value": "51",
                    "count": 2
                },
                {
                    "label": "Gray",
                    "value": "52",
                    "count": 8
                },
                {
                    "label": "Green",
                    "value": "53",
                    "count": 17
                },
                {
                    "label": "Lavender",
                    "value": "54",
                    "count": 1
                },
                {
                    "label": "Orange",
                    "value": "56",
                    "count": 9
                },
                {
                    "label": "Purple",
                    "value": "57",
                    "count": 6
                },
                {
                    "label": "Red",
                    "value": "58",
                    "count": 21
                },
                {
                    "label": "White",
                    "value": "59",
                    "count": 6
                },
                {
                    "label": "Yellow",
                    "value": "60",
                    "count": 9
                }
            ]
        },
        {
            "code": "climate",
            "label": "Weather",
            "options": [
                {
                    "label": "All-Weather",
                    "value": "201",
                    "count": 38
                },
                {
                    "label": "Cold",
                    "value": "202",
                    "count": 2
                },
                {
                    "label": "Cool",
                    "value": "203",
                    "count": 22
                },
                {
                    "label": "Indoor",
                    "value": "204",
                    "count": 35
                },
                {
                    "label": "Mild",
                    "value": "205",
                    "count": 4
                },
                {
                    "label": "Rainy",
                    "value": "206",
                    "count": 5
                },
                {
                    "label": "Spring",
                    "value": "207",
                    "count": 21
                },
                {
                    "label": "Warm",
                    "value": "208",
                    "count": 25
                },
                {
                    "label": "Windy",
                    "value": "209",
                    "count": 18
                },
                {
                    "label": "Wintry",
                    "value": "210",
                    "count": 3
                }
            ]
        },
        {
            "code": "pattern",
            "label": "Pattern",
            "options": [
                {
                    "label": "Color-Blocked",
                    "value": "194",
                    "count": 4
                },
                {
                    "label": "Solid",
                    "value": "196",
                    "count": 43
                },
                {
                    "label": "Striped",
                    "value": "198",
                    "count": 1
                }
            ]
        },
        {
            "code": "style_general",
            "label": "Style",
            "options": [
                {
                    "label": "Insulated",
                    "value": "116",
                    "count": 5
                },
                {
                    "label": "Jacket",
                    "value": "117",
                    "count": 1
                },
                {
                    "label": "Lightweight",
                    "value": "119",
                    "count": 6
                },
                {
                    "label": "Hooded",
                    "value": "120",
                    "count": 3
                },
                {
                    "label": "Heavy Duty",
                    "value": "121",
                    "count": 2
                },
                {
                    "label": "Rain Coat",
                    "value": "122",
                    "count": 5
                },
                {
                    "label": "Hard Shell",
                    "value": "123",
                    "count": 5
                },
                {
                    "label": "Soft Shell",
                    "value": "124",
                    "count": 5
                },
                {
                    "label": "Windbreaker",
                    "value": "125",
                    "count": 6
                },
                {
                    "label": "&frac14; zip",
                    "value": "127",
                    "count": 7
                },
                {
                    "label": "Full Zip",
                    "value": "128",
                    "count": 5
                },
                {
                    "label": "Reversible",
                    "value": "129",
                    "count": 1
                },
                {
                    "label": "Tank",
                    "value": "134",
                    "count": 12
                },
                {
                    "label": "Tee",
                    "value": "135",
                    "count": 12
                }
            ]
        },
        {
            "code": "size",
            "label": "Size",
            "options": [
                {
                    "label": "XS",
                    "value": "166",
                    "count": 48
                },
                {
                    "label": "S",
                    "value": "167",
                    "count": 48
                },
                {
                    "label": "M",
                    "value": "168",
                    "count": 48
                },
                {
                    "label": "L",
                    "value": "169",
                    "count": 48
                },
                {
                    "label": "XL",
                    "value": "170",
                    "count": 48
                }
            ]
        },
        {
            "code": "material",
            "label": "Material",
            "options": [
                {
                    "label": "Cocona&reg; performance fabric",
                    "value": "142",
                    "count": 11
                },
                {
                    "label": "Fleece",
                    "value": "144",
                    "count": 10
                },
                {
                    "label": "Cotton",
                    "value": "33",
                    "count": 5
                },
                {
                    "label": "Hemp",
                    "value": "145",
                    "count": 2
                },
                {
                    "label": "LumaTech&trade;",
                    "value": "147",
                    "count": 7
                },
                {
                    "label": "Lycra&reg;",
                    "value": "148",
                    "count": 3
                },
                {
                    "label": "Nylon",
                    "value": "37",
                    "count": 10
                },
                {
                    "label": "Polyester",
                    "value": "38",
                    "count": 32
                },
                {
                    "label": "Rayon",
                    "value": "39",
                    "count": 1
                },
                {
                    "label": "Spandex",
                    "value": "150",
                    "count": 1
                },
                {
                    "label": "HeatTec&reg;",
                    "value": "151",
                    "count": 3
                },
                {
                    "label": "EverCool&trade;",
                    "value": "152",
                    "count": 4
                },
                {
                    "label": "Organic Cotton",
                    "value": "153",
                    "count": 16
                },
                {
                    "label": "CoolTech&trade;",
                    "value": "155",
                    "count": 1
                },
                {
                    "label": "Wool",
                    "value": "158",
                    "count": 7
                }
            ]
        }
    ]
}
```

## Step 2: Output
- Structured Evaluation Report

### Example Output
```json
{
  "intentId": "uuid",
  "accuracyScore": 0.72,
  "confidence": "medium",
  "issues": [
    {
      "type": "missing_attribute",
      "attribute": "waterproof_rating",
      "impact": "high"
    }
  ]
}
```

### Suggestion Input
```json
{
    "intent": {
        "signals": {
            "climate": {
                "Warm": 1
            },
            "material": {
                "Polyester": 1
            }
        }
    },
    "products": [
        {
            "sku": "MT12",
            "title": "Cassius Sparring Tank",
            "shortDescription": "Whether you're up against a partner or the clock, the Cassius Sparring Tank is in your corner, moving effortless with your body.",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "LumaTech&trade;",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MT11",
            "title": "Atlas Fitness Tank",
            "shortDescription": "From weekend warrior to Warrior Pose II, no role can beat the Atlas Fitness Tank, a versatile top for gym and yoga",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Organic Cotton",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MT09",
            "title": "Sinbad Fitness Tank",
            "shortDescription": "Solid in color and construction, the 100% cotton-weave Sinbad Fitness Tank moves with you as you press, hold, crunch and stride your",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MT08",
            "title": "Sparta Gym Tank",
            "shortDescription": "The high performance Sparta Gym Tank is made with thin, light, merino wool and aims to be the perfect base layer or",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MT07",
            "title": "Argus All-Weather Tank",
            "shortDescription": "<p>The Argus short sleeve Tank is your friend in hot summer weather to become your favorite base layer or go-to cover for hot outdoor workouts.</p>",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Organic Cotton",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MT06",
            "title": "Vulcan Weightlifting Tank",
            "shortDescription": "The Olympic styled Vulcan Weightlifting Tank features polyester stretch and flex.",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Cocona&reg; performance fabric",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MT05",
            "title": "Rocco Gym Tank",
            "shortDescription": "Rocco Gym Tank – Weights?",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Cocona&reg; performance fabric",
                    "Organic Cotton",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MT04",
            "title": "Helios Endurance Tank",
            "shortDescription": "Helios Endurance Tank – When training pushes your limits, you need gear that works harder than you.",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Cocona&reg; performance fabric",
                    "Organic Cotton",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MT03",
            "title": "Primo Endurance Tank",
            "shortDescription": "Chances are your workout goes beyond free weights, which is why the Primo Endurance Tank employs maximum versatility.",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "LumaTech&trade;",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MT01",
            "title": "Erikssen CoolTech™ Fitness Tank",
            "shortDescription": "<p>A good running tank helps make the miles pass by keep you cool. The Erikssen CoolTech&trade; Fitness Tank completes that mission, with performance fabric engineered to wick perspiration and promote airflow.</p>\n<p>&bull; Red performance tank.<br />&bull; Slight scoop neckline. <br />&bull; Reflectivity. <br />&bull; Machine wash/dry.</p>",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Cotton",
                    "HeatTec&reg;",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MS08",
            "title": "Strike Endurance Tee",
            "shortDescription": "Strike Endurance Tee – While grit and purpose keep you going, it helps to have a little extra comfort, too.",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Cool",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Organic Cotton",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MS01",
            "title": "Aero Daily Fitness Tee",
            "shortDescription": "Aero Daily Fitness Tee – Need an everyday action tee that helps keep you dry?",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MS06",
            "title": "Zoltan Gym Tee",
            "shortDescription": "Zoltan Gym Tee – This short-sleeve wonder works twice as hard to give you good gym days and good looks.",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Organic Cotton",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MS03",
            "title": "Balboa Persistence Tee",
            "shortDescription": "The Balboa Persistence Tee is a must-have for any athlete, Philadelphia or elsewhere.",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Cocona&reg; performance fabric",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MS12",
            "title": "Atomic Endurance Running Tee (Crew-Neck)",
            "shortDescription": "Atomic Endurance Running Tee (Crew-Neck) – Like it's v-neck counterpart, the crew-neck Atomic Tee will get you to your goal and beyond with its many load-bearing features: ultra-lightweight,",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Cocona&reg; performance fabric",
                    "Organic Cotton",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MS11",
            "title": "Atomic Endurance Running Tee (V-neck)",
            "shortDescription": "<p>Atomic Endurance Running Tee (V-neck) – Reach your limit and keep on going in the Atomic Endurance Running Tee. Can suit for wam hot summer weather</p>",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Cocona&reg; performance fabric",
                    "Organic Cotton",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MS09",
            "title": "Ryker LumaTech™ Tee (Crew-neck)",
            "shortDescription": "<p>The crew-neck Ryker LumaTech&trade; Tee hides premium performance technology beneath unassuming looks. The featherweight blend of fabrics wicks away moisture to keep you cool and dry in every phase of your active life.</p>\n<p>&bull; Royal polyester tee with black accents.<br />&bull; Relaxed fit. <br />&bull; Short-Sleeve. <br />&bull; Machine wash/dry.</p>",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "LumaTech&trade;",
                    "Polyester"
                ]
            }
        },
        {
            "sku": "MS04",
            "title": "Gobi HeatTec® Tee",
            "shortDescription": "<p>When the training gets intense, the Gobi HeatTec&reg; Tee works as hard as you do to maintain your cool. The moisture-wicking material promises drier comfort, while breathable side panels deliver extra stretch that's sure to keep you moving.</p>\n<p>&bull; Orange micropolyester shirt.<br />&bull; HeatTec&reg; wicking fabric.<br />&bull; Crew neckline. <br />&bull; Machine wash/dry.</p>",
            "attributes": {
                "climate": [
                    "All-Weather",
                    "Indoor",
                    "Warm"
                ],
                "material": [
                    "Cotton",
                    "HeatTec&reg;",
                    "Polyester"
                ]
            }
        }
    ]
}
```

### Suggestions response
```json
{
    "suggestions": [
        {
            "sku": "MT12",
            "match": 100.0,
            "reason": "The Cassius Sparring Tank is made of Polyester and designed for warm climates, matching both intent signals."
        },
        {
            "sku": "MT09",
            "match": 100.0,
            "reason": "The Sinbad Fitness Tank is made entirely of Polyester and suitable for warm conditions, aligning perfectly with the user's intent."
        },
        {
            "sku": "MT06",
            "match": 100.0,
            "reason": "The Vulcan Weightlifting Tank features Polyester and is suitable for warm climates, directly addressing the user's requirements."
        },
        {
            "sku": "MT08",
            "match": 100.0,
            "reason": "The Sparta Gym Tank is made of Polyester and designed for warm weather, making it a strong match for the user's intent."
        },
        {
            "sku": "MT03",
            "match": 100.0,
            "reason": "The Primo Endurance Tank is made of Polyester and suitable for warm climates, fulfilling the user's intent effectively."
        }
    ]
}
```

****
### Real response

## Accuracy Evaluation Agent — Spec v1
### High-Level Aim
Monitor and evaluate the correctness and quality of each intent execution by analysing:
- intent interpretation (signals → filters)
- execution outcome (filters → results)
- fallback behaviour (suggestion trigger and quality)
  
The agent produces structured evaluation reports to assess:
- reliability
- relevance
- system behaviour correctness
### Non-Functional Constraint
- The agent must operate asynchronously and must not introduce latency or failure risk to the runtime engine.

### Technical insights
2 messages may be sent to the agent when 1 request is processed by the engine.
- message 1: intent + catalog filters + signals worked out by the engine 
- message 2: product data + signals and recommendations with score 
These 2 messages are eventually aggregated by the agent to build a reliability report for the request

## UI capabilities
1. Aggregate reporting
   failure rate
   suggestion usage rate
   average relevance score
2. Request trace
   full event (input → decision → outcome)
   evaluation report
   timeline (optional)

