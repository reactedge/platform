export function handleArrowButtonKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    action: () => void,
    allowedKeys: string[] = ['Enter', ' ']
) {
    if (allowedKeys.includes(event.key)) {
        event.preventDefault();
        action();
    }
}
