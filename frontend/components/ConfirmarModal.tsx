import React from 'react';

interface ConfirmarModalProps {
  visivel: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
  mensagem: string;
}

export default function ConfirmarModal({
  visivel,
  onConfirmar,
  onCancelar,
  mensagem,
}: ConfirmarModalProps) {
  if (!visivel) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 text-white p-6 rounded-xl max-w-sm w-full shadow-lg">
        <p className="mb-4 text-center">{mensagem}</p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
            onClick={onConfirmar}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
