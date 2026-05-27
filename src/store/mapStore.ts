let selectedPartnerId:
    string | null = null;

const listeners =
    new Set<() => void>();

export function setSelectedPartner(
    id: string
) {
    selectedPartnerId = id;

    listeners.forEach((cb) =>
        cb()
    );
}

export function getSelectedPartner() {
    return selectedPartnerId;
}

export function subscribe(
    cb: () => void
) {
    listeners.add(cb);

    return () => {
        listeners.delete(cb);
    };
}