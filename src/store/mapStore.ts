let selectedjavitoId:
    string | null = null;

const listeners =
    new Set<() => void>();

export function setSelectedjavito(
    id: string
) {
    selectedjavitoId = id;

    listeners.forEach((cb) =>
        cb()
    );
}

export function getSelectedjavito() {
    return selectedjavitoId;
}

export function subscribe(
    cb: () => void
) {
    listeners.add(cb);

    return () => {
        listeners.delete(cb);
    };
}