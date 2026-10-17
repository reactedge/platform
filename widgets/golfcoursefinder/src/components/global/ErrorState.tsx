interface ErrorStateProps {
    readonly message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
    return <p className="golfCourseFinder__error" role="alert">{message}</p>;
}
