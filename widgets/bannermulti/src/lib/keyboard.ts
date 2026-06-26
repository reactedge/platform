export function handleArrowButtonKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    action: () => void,
    allowedKeys: string[] = ['Enter', ' ']
) {
    console.log('keydonw pressed')
    if (allowedKeys.includes(event.key)) {
        event.preventDefault();
        action();
    }
}
