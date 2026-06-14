export type ErrorResponse = {
    "error": string
}

type BaseResponse<TData> = TData | ErrorResponse;

export interface IntentControllerInterface {

}