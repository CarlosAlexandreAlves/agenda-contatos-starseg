interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  foto?: string;
  createdAt?: string;
}

interface ContatoCardProps {
  contato: Contato;
  onDelete: (id: number) => void;
  deletando: boolean;
  onEditar: (contato: Contato) => void;
}

export default function ContatoCard({ contato, onDelete, deletando, onEditar }: ContatoCardProps) {
  return (
    <li className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-xl shadow hover:shadow-md transition-shadow w-full border border-zinc-200 dark:border-zinc-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {contato.foto && (
          <img
            src={`http://localhost:4000/uploads/${contato.foto}`}
            alt={`Foto de ${contato.nome}`}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-blue-500"
          />
        )}
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white">{contato.nome}</h3>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">📞 {contato.telefone}</p>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">✉️ {contato.email}</p>
        </div>
      </div>

      {/* Botões ficam fora da linha de conteúdo principal */}
      <div className="mt-4 flex justify-end gap-2 flex-wrap">
        <button
          onClick={() => onEditar(contato)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black text-sm px-3 py-1 rounded"
          type="button"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(contato.id)}
          disabled={deletando}
          className={`bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded ${
            deletando ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          type="button"
        >
          {deletando ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </li>
  );
}
