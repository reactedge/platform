import {useMagentoCategory} from "../infra/useMagentoCategory.tsx";
import {useSystemState} from "../../state/System/useSystemState.ts";

export function useCategory(
    urlKey: string
) {
    const { bootstrap } = useSystemState()
    const initialData = bootstrap?.categoryData

    const shouldFetch =
        !initialData;

    const {
        magentoCategory,
        loading: categoryLoading,
        error: categoryError,
        refetch,
    } = useMagentoCategory(
        shouldFetch,
        urlKey
    );

    return {
        categoryData:
            initialData ??
            magentoCategory,

        categoryLoading:
            shouldFetch
                ? categoryLoading
                : false,

        categoryError:
            shouldFetch
                ? categoryError
                : null,

        refetch,
    };
}