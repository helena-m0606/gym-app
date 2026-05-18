type ModalProps = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    maxWidth?: string;
};

export default function Modal({
    open,
    onClose,
    title,
    children,
    maxWidth = 'max-w-lg',
}: ModalProps) {

    if (!open) return null;

    return (

        <div
            className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/50
            "
        >

            {/* CONTENIDO */}
            <div
                className={`
                bg-white rounded-2xl shadow-xl
                w-full ${maxWidth}
                p-6
                `}
            >

                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                        text-gray-500 hover:text-black
                        text-xl
                        "
                    >
                        ✕
                    </button>

                </div>

                {/* BODY */}
                {children}

            </div>

        </div>
    );
}