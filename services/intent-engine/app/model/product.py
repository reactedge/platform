def pre_score_products(products, signals, limit=12):
    scored = []

    print(f"\n[SCORING START]")
    print(f"[SIGNALS] {signals}")

    for p in products:
        score = 0

        print(f"\n[PRODUCT] {p.sku}")
        print(f"  attributes: {p.attributes}")

        for attr, values in signals.items():
            product_values = p.attributes.get(attr, [])

            for v in product_values:
                if v in values:
                    weight = values[v]
                    score += weight

                    print(f"  + match {attr}:{v} → +{weight}")

        print(f"  => final score: {score}")

        scored.append((p, score))

    scored.sort(key=lambda x: x[1], reverse=True)

    print("\n[RANKED RESULTS]")
    for p, s in scored:
        print(f"  {p.sku} → {s}")

    return scored[:limit]


