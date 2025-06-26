interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email: string;
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
    <li className="bg-white dark:bg-zinc-800 p-3 rounded-xl shadow hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">{contato.nome}</h3> 
      <p className="text-sm zinc-700 dark:text-zinc-300 mt-1">📞{contato.telefone}</p>
      <p className="text-sm zinc-700 dark:text-zinc-300">✉️{contato.email}</p>

      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => onEditar(contato)}
          className="bg-yellow-400 hover:bg-yellow-500 text-black tex-sm px-3 py-1 rounded"
          type="button"
        >
          Editar
        </button>

        <button
          onClick={() => onDelete(contato.id)}
          disabled={deletando}
          className={`bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded ${deletando ? 'opacity-50 cursor-not-allowed' : ''}`}
          type="button"
        >
          {deletando ? 'Excluindo...' : 'Excluir'}
        </button>
      </div>
    </li>
  );
}
