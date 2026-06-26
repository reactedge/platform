import type {StoreWithDistance} from "../../domain/store.types.ts";

interface StoreResultsTableProps {
    readonly stores: readonly StoreWithDistance[];
}

export function StoreResultsTable({ stores }: StoreResultsTableProps) {
    if (stores.length === 0) {
        return (
            <p className="storeTable__empty">
                No stores found within the selected distance.
            </p>
        );
    }

    return (
        <div className="storeTable">
            <h3 className="storeTable__title">
                Stores Found ({stores.length})
            </h3>

            <table className="storeTable__table">
                <thead>
                <tr className="storeTable__headRow">
                    <th className="storeTable__th">Name</th>
                    <th className="storeTable__th">Opening Hours</th>
                    <th className="storeTable__th">Distance</th>
                </tr>
                </thead>

                <tbody>
                {stores.map(store => (
                    <tr
                        key={`${store.lat},${store.lng}`}
                        className="storeTable__row"
                    >
                        <td className="storeTable__td">{store.name}</td>
                        <td className="storeTable__td">{store.hours}</td>
                        <td className="storeTable__td">
                            {store.distance?.toFixed(1)} km
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
