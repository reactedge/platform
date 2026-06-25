export class ErrorWrapper {
    handle = (error: unknown) => {
        if (error instanceof Error) {
            console.log(error.message)
        } else {
            throw error
        }
    }
}